import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import multer from 'multer';
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import MongoStore from 'connect-mongo';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const SALT_ROUNDS = 10;

// MongoDB URI
const uri = process.env.MONGO_URI || "your-default-mongodb-uri";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let usersCollection;

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("login");
    usersCollection = db.collection("users");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

connectToMongoDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration using MongoStore
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: uri,
      collectionName: 'sessions',
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      maxAge: 600000, // 10 minutes
    },
  })
);

// Middleware to prevent caching for authenticated routes
function noCache(req, res, next) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
}

// Set up multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Protected Routes
app.get('/home.html', isAuthenticated, noCache, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/profile.html', isAuthenticated, noCache, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

// Signup route
app.post('/api/signup', async (req, res) => {
  const { name, usn, email, password } = req.body;
  try {
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = { name, usn, email, password: hashedPassword };
    await usersCollection.insertOne(newUser);

    res.json({ success: true, message: 'Signup successful', redirectUrl: '/login.html' });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: 'Server error, please try again' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await usersCollection.findOne({ email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        req.session.user = { name: user.name, email: user.email };
        res.json({ success: true, redirectUrl: '/home.html', userName: user.name, userEmail: user.email });
      } else {
        res.json({ success: false, message: 'Invalid email or password' });
      }
    } else {
      res.json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: 'Server error, please try again' });
  }
});

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "Please log in to access this page." });
  }
}

// Profile APIs
app.get('/api/profile', isAuthenticated, async (req, res) => {
  try {
    const user = await usersCollection.findOne({ email: req.session.user.email });

    if (user) {
      res.json({
        username: user.name,
        email: user.email,
        phone: user.phone || "",
        usn: user.usn || "",
        address: user.address || "",
        profilePic: user.profilePic || "",
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error, please try again" });
  }
});

app.put('/api/profile', isAuthenticated, async (req, res) => {
  const { phone, usn, address } = req.body;

  if (!req.session.user || !req.session.user.email) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  try {
    const userEmail = req.session.user.email;

    const result = await usersCollection.updateOne(
      { email: userEmail },
      { $set: { phone, usn, address } }
    );

    if (result.modifiedCount > 0) {
      res.json({ message: "Profile updated successfully" });
    } else {
      res.status(400).json({ message: "Failed to update profile" });
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error, please try again" });
  }
});

// Profile picture upload
app.post('/api/uploadProfilePic', isAuthenticated, upload.single('profilePic'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const base64Image = req.file.buffer.toString('base64');
    const profilePicUrl = `data:${req.file.mimetype};base64,${base64Image}`;

    await usersCollection.updateOne(
      { email: req.session.user.email },
      { $set: { profilePic: profilePicUrl } }
    );

    res.json({ message: "Profile picture updated successfully", imageUrl: profilePicUrl });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ message: "Server error, please try again" });
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to log out" });
    }
    res.clearCookie('connect.sid'); // Clear session cookie
    res.redirect('/login.html');
  });
});

// Fallback for unmatched routes
app.all('*', (req, res) => {
  res.status(404).send('Page not found.');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

import cors from 'cors';
app.use(cors({ origin: 'https://campus-reach.vercel.app', credentials: true }));
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));