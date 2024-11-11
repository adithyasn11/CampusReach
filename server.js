import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import { MongoClient, ServerApiVersion } from 'mongodb';

const app = express();
const PORT = process.env.PORT || 3000;
const SALT_ROUNDS = 10;

const uri = "mongodb+srv://adithyasn2487:Adithya452005@campusreach.j19dc.mongodb.net/?retryWrites=true&w=majority&appName=CampusReach";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure session middleware
app.use(
  session({
    secret: 'your_secret_key', // Replace with a strong secret key in production
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 600000 }, // Set `secure: true` in production with HTTPS
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// User signup
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = { name, email, password: hashedPassword };
    await usersCollection.insertOne(newUser);

    res.json({ success: true, message: 'Signup successful', redirectUrl: '/login.html' });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: 'Server error, please try again' });
  }
});

// User login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await usersCollection.findOne({ email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        // Store user data in session
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

// Get profile data for logged-in user
app.get('/api/profile', isAuthenticated, async (req, res) => {
  try {
    const user = await usersCollection.findOne({ email: req.session.user.email });

    if (user) {
      res.json({
        username: user.name,
        email: user.email,
        phone: user.phone || "",
        alternateEmail: user.alternateEmail || "",
        address: user.address || ""
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error, please try again" });
  }
});

// Update profile data for logged-in user
app.put('/api/profile', isAuthenticated, async (req, res) => {
  const { phone, alternateEmail, address } = req.body;

  try {
    const result = await usersCollection.updateOne(
      { email: req.session.user.email },
      { $set: { phone, alternateEmail, address } }
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

// Logout route to destroy session
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to log out" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
