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
const keys = require('./config/keys');
const passportSetup = require('./config/passport-setup');
const connectDB = require('./config/db');

const app = express();

// Parse incoming requests with JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Configure CORS
const corsOptions = {
    origin: 'http://localhost:5173', 
    credentials: true,
    optionSuccessStatus: 200
};
app.use(cors(corsOptions));



// Initialize session with MongoDB store
app.use(session({
    secret: keys.session.cookieKey,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: keys.mongodb.dbURI, collectionName: 'sessions' }),
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
