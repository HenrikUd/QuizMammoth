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
    secure: process.env.NODE_ENV === 'production', // Always use secure cookies in production
    sameSite: 'none',
    httpOnly: true, // Prevents client-side access to the cookie
    domain: 'mammothbackend.vercel.app' // Set this to your domain in production
  }
}));

// If you're behind a proxy (e.g., Nginx), you might also need this:
app.set('trust proxy', 1);

// Initialize Passport and session handling
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/users', usersRoutes);
app.use('/api', userQuizRoutes); 
app.use('/api/answers', answerRoutes);


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
