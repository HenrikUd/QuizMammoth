const envFile = process.env.NODE_ENV === 'production' ? '../../.env.production' : '../../.env';
require('dotenv').config({ path: path.resolve(__dirname, '..', envFile) });
const express = require('express');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const usersRoutes = require('./routes/users-routes'); 
const userQuizRoutes = require('./routes/user-quizzes'); // New user-quiz routes
const answerRoutes = require('./routes/answer-routes');
const connectDB = require('./config/db');
require('./config/passport-setup'); // Ensure this line is present
const app = express();

// Parse incoming requests with JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Configure CORS
// Get allowed origins from environment variable
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',');

// Configure CORS
const corsOptions = {
    origin: (origin, callback) => {
        // Check if the origin is in the list of allowed origins or if it's a local request with no origin
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));



// Initialize session with MongoDB store
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI, collectionName: 'sessions' }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// Initialize passport (use the setup from passport-setup.js)
app.use(passport.initialize());
app.use(passport.session());

// Set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/users', usersRoutes);
app.use('/api', userQuizRoutes); // Changed to use '/api' prefix
app.use('/api', answerRoutes); // Changed to use '/api' prefix

// Endpoint to check authentication status
app.get('/api/auth/check', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ loggedIn: true, userId: req.user._id });
    } else {
        res.json({ loggedIn: false });
    }
});

// Serve static files from the 'build' directory of the frontend
app.use(express.static(path.join(__dirname, '..', 'MammothFrontEnd', 'build')));

// Define route for the backend start page
app.get('/', (req, res) => {
    res.render('home');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Serve the React application for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'MammothFrontEnd', 'build', 'index.html'));
});

// Connect to MongoDB and start the server
connectDB()
  .then(() => {
    const port = process.env.PORT || 8082;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });
// Export the app and API base URL based on the environment
const apiBaseUrl = process.env.API_URL;
module.exports = { app, apiBaseUrl };