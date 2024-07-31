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


// Session middleware configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: process.env.MONGODB_URI, 
    collectionName: 'sessions' 
  }),
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'none',
    httpOnly: true, // Prevents client-side access to the cookie
    domain: 'vercel.app' // to allow cookie movement between backend and frontend
  }
}));

app.set('trust proxy', 1);

const allowedOrigins = ['http://localhost:5173', 'https://quiz-mammoth.vercel.app', 'https://mammothbackend.vercel.app', 'quiz-mammoth.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin, like mobile apps or curl requests
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));



// Initialize Passport and session handling
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/users', usersRoutes);
app.use('/api', userQuizRoutes); 
app.use('/api', answerRoutes);



app.get('/', (req, res) => {
    res.status(200).send('Hello, World, This is my API!, Check it out!');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});



  module.exports = app;
