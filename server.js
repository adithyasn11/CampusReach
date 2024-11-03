import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
<<<<<<< HEAD
import cors from 'cors';
=======
>>>>>>> 2e8bbfa (signup page updated)

const app = express();
const PORT = process.env.PORT || 3000;

<<<<<<< HEAD
mongoose.connect('mongodb+srv://adithyasn2487:Adithya452005@campusreach.j19dc.mongodb.net/')
    .then(() => console.log('MongoDB connected'))
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    });

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
=======
mongoose.connect('mongodb://localhost:27017/login').then(() => console.log('MongoDB connected')).catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
>>>>>>> 2e8bbfa (signup page updated)
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
<<<<<<< HEAD
        const db = mongoose.connection.useDb('login'); 
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ email, password }); 

        if (user) {
            res.json({ success: true, redirectUrl: '/home.html' });
        } else {
            res.json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: 'Server error, please try again' });
=======
        const user = await User.findOne({ email, password });
        if (user) {
            res.sendFile(path.join(__dirname, 'public', 'home.html'));
        } else {
            res.send('Invalid email or password');
        }
    } catch (error) {
        res.status(500).send('Error logging in');
>>>>>>> 2e8bbfa (signup page updated)
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
<<<<<<< HEAD

app.use(cors());
=======
>>>>>>> 2e8bbfa (signup page updated)
