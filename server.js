require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');
const MongoStore = require('connect-mongo');

// Environment variables and constants
const PORT = process.env.PORT || 7544;
const MONGO_URI = process.env.MONGO_URI;
const SESSION_SECRET = process.env.SESSION_SECRET || 'your-fallback-secret';

// Initialize express app
const app = express();

// MongoDB connection setup
const connectToMongoDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB Atlas!');
        
        // List collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));
    } catch (err) {
        console.error('Error connecting to MongoDB Atlas:', err);
        process.exit(1);
    }
};

// User Schema
const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true,
        trim: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true
    },
    password: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Middleware setup
const setupMiddleware = () => {
    // Session configuration
    app.use(session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: MONGO_URI,
            autoRemove: 'interval',
            autoRemoveInterval: 10
        }),
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 // 24 hours
        }
    }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Request logger
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
};

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    next();
};

// Route handlers
const authController = {
    // Get session status
    getStatus: (req, res) => {
        res.json({ isAuthenticated: !!req.session.userId });
    },

    // Register new user
    register: async (req, res) => {
        console.log('Registration attempt:', req.body);
        try {
            const { username, email, password } = req.body;

            if (!username?.trim() || !email?.trim() || !password?.trim()) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            const existingUser = await User.findOne({ email: email.toLowerCase() });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already registered' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({
                username: username.trim(),
                email: email.toLowerCase().trim(),
                password: hashedPassword
            });
            await user.save();

            console.log('User created successfully:', user._id);

            req.session.userId = user._id;
            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    return res.status(500).json({ error: 'Session creation failed' });
                }
                res.status(201).json({ success: true, redirectUrl: '/' });
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ error: 'Registration failed: ' + error.message });
        }
    },

    // Login user
    login: async (req, res) => {
        console.log('Login attempt:', req.body.email);
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email: email.toLowerCase() });
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            req.session.userId = user._id;
            req.session.save((err) => {
                if (err) {
                    console.error('Session save error:', err);
                    return res.status(500).json({ error: 'Login failed' });
                }
                res.json({ success: true, redirectUrl: '/' });
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Login failed: ' + error.message });
        }
    },

    // Logout user
    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Logout error:', err);
                return res.status(500).json({ error: 'Logout failed' });
            }
            res.clearCookie('connect.sid');
            res.json({ success: true, redirectUrl: '/login' });
        });
    }
};

// Setup routes
const setupRoutes = () => {
    // Auth routes
    app.get('/api/auth/status', authController.getStatus);
    app.post('/api/register', authController.register);
    app.post('/api/login', authController.login);
    app.post('/api/logout', isAuthenticated, authController.logout);

    // Static files
    app.use(express.static(path.join(__dirname, '../')));
    app.use(express.static(path.join(__dirname, 'public')));

    // SPA fallback
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
};

// Initialize server
const startServer = async () => {
    try {
        await connectToMongoDB();
        setupMiddleware();
        setupRoutes();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Server initialization error:', error);
        process.exit(1);
    }
};

// Start the server
startServer();