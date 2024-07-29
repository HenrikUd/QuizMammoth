const express = require('express');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const usersRoutes = require('./routes/users-routes'); 
const userQuizRoutes = require('./routes/user-quizzes'); 
const answerRoutes = require('./routes/answer-routes');
const connectDB = require('../config/db');


dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

require('../config/passport-setup');

connectDB().then(() => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const allowedOrigins = ['http://localhost:5173', 'https://quiz-mammoth.vercel.app', 'https://mammothbackend.vercel.app'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};



app.use(cors(corsOptions));

// Session middleware configuration
app.use(session({
  secret: process.env.SESSION_SECRET, // Ensure this is set in your environment variables
  resave: false, // Don't resave session if it hasn't been modified
  saveUninitialized: false, // Don't save uninitialized sessions
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI, collectionName: 'sessions' }), // MongoDB session store
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    secure: process.env.NODE_ENV === 'production', // Set secure cookies in production
    sameSite: 'none' // Allows cross-site cookies
  }
}));

// Initialize Passport and session handling
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/users', usersRoutes);
app.use('/api', userQuizRoutes); 
app.use('/api/answers', answerRoutes);

app.get('/api/auth/check', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ loggedIn: true, userId: req.user._id });
    } else {
        res.json({ loggedIn: false });
    }
});

/* app.use(express.static(path.join(__dirname, '..', 'MammothFrontEnd', 'build')));
 */
app.get('/', (req, res) => {
    res.status(200).send('Hello, World, This is my API!, Check it out!');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

/* app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'MammothFrontEnd', 'build', 'index.html'));
}); */

/* connectDB()
  .then(() => {
    const port = process.env.PORT || 8082;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }); */

 /*  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not Found' });
  }); */

  module.exports = app;
