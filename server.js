import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import multer from "multer";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
import MongoStore from "connect-mongo";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const SALT_ROUNDS = 10;

// MongoDB URI
const uri = process.env.MONGODB_URI || "your-default-mongodb-uri";

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
app.use(express.static(path.join(__dirname, "public")));

const allowedOrigins = [
  "https://campus-reach.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:5500",
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Allow cookies and headers
  })
);

// Session configuration using MongoStore
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: uri,
      collectionName: "sessions",
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // Set to true in production
      maxAge: 3600000, // 10 minutes
    },
  })
);

// Middleware to prevent caching for authenticated routes
function noCache(req, res, next) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
}

// Set up multer for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Protected Routes
app.get("/home.html", isAuthenticated, noCache, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "shome.html"));
});

app.get("/profile.html", isAuthenticated, noCache, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "profile.html"));
});

app.get("/fprofile.html", isAuthenticated, noCache, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "fprofile.html"));
});

// Signup route
app.post("/api/signup", async (req, res) => {
  const { name, usn, email, password } = req.body;
  try {
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = {
      name,
      usn,
      email,
      password: hashedPassword,
      isFaculty: false,
      department: "AI & DS",
    };
    await usersCollection.insertOne(newUser);

    res.json({ success: true, message: "Signup successful", redirectUrl: "/login.html" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, message: "Server error, please try again" });
  }
});

// Login route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await usersCollection.findOne({ email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        req.session.user = {
          username: user.name,
          email: user.email,
          isFaculty: user.isFaculty,
          usn: user.usn, // Include USN in the session
        };

        // Redirect based on isFaculty value
        const redirectUrl = user.isFaculty ? "/fhome.html" : "/shome.html";
        res.json({
          success: true,
          redirectUrl,
          username: user.name,
          userEmail: user.email,
        });
      } else {
        res.json({ success: false, message: "Invalid email or password" });
      }
    } else {
      res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error, please try again" });
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
app.get("/api/profile", isAuthenticated, async (req, res) => {
  try {
    const user = await usersCollection.findOne({ email: req.session.user.email });

    if (user) {
      res.json({
        username: user.name,
        email: user.email,
        usn: user.usn || "N/A",
        phone: user.phone || "",
        address: user.address || "",
        profilePic: user.profilePic || "",
        cabin: user.cabin || "",
        availability: user.availability || false, // Default to false if not set
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error, please try again" });
  }
});

app.get("/api/profile1", isAuthenticated, async (req, res) => {
  try {
    const user = await usersCollection.findOne({ email: req.session.user.email });

    if (user) {
      res.json({

        usn: user.usn || "N/A",
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error, please try again" });
  }
});

// Update profile with availability
app.put("/api/profile", isAuthenticated, async (req, res) => {
  const { username, phone, address, cabin, availability } = req.body;

  if (!req.session.user || !req.session.user.email) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  try {
    const userEmail = req.session.user.email;

    const updateFields = {};
    if (username) updateFields.name = username;
    if (phone) updateFields.phone = phone;
    if (address) updateFields.address = address;
    if (cabin) updateFields.cabin = cabin;

    if (typeof availability === "boolean") {
      updateFields.availability = availability;
    }

    const result = await usersCollection.updateOne(
      { email: userEmail },
      { $set: updateFields }
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

app.get("/api/students", isAuthenticated, async (req, res) => {
  try {
    // Fetch students where isFaculty is false
    const students = await usersCollection
      .find({ isFaculty: false })
      .project({ name: 1, usn: 1, profilePic: 1, department: 1 }) // Select only the required fields
      .toArray();

    if (!students || students.length === 0) {
      return res.status(404).json({ message: "No students found." });
    }

    // Return student data
    res.json(students);
  } catch (error) {
    console.error("Error fetching students data:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Faculty Directory API (Updated with USN in response)
app.get("/api/faculty", isAuthenticated, async (req, res) => {
  try {
    // Fetch faculty members where isFaculty is true
    const facultyMembers = await usersCollection.find({ isFaculty: true }).toArray();

    if (!facultyMembers || facultyMembers.length === 0) {
      return res.status(404).json({ message: "No faculty members found." });
    }

    // Return faculty data
    res.json(facultyMembers);
  } catch (error) {
    console.error("Error fetching faculty data:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Faculty Message API
app.put("/api/faculty/message/:facultyId", isAuthenticated, async (req, res) => {
  const { facultyId } = req.params;
  const { message, msgusn } = req.body;

  if (!message || !msgusn) {
    return res.status(400).json({ error: "Message and sender's USN are required" });
  }

  try {
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(facultyId) },
      { $push: {messages:{ msgusn, message, timestamp: new Date() } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    res.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fallback for unmatched routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
