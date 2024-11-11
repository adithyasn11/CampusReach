import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';
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
    process.exit(1);  // Stop server if connection fails
  }
}

// Call `connectToMongoDB` once when starting the server
connectToMongoDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html')); // Adjusted path to serve index.html from the root
});

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

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await usersCollection.findOne({ email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        res.json({ success: true, redirectUrl: '/home.html', userName: user.name });
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

// Add this to server.js
app.get('/getUserName', (req, res) => {
  // Assuming the user data is stored in the session or similar server-side storage
  const user = { userName: "John Doe" }; // Replace with your actual logic to get the user’s name

  if (user && user.userName) {
      res.json({ userName: user.userName });
  } else {
      res.status(404).json({ error: "User not found" });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
