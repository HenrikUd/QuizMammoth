const mongoose = require('mongoose');

// Define the User Schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  googleId: {
    type: String,
    unique: true // Assuming Google IDs are unique
  },
  quizzes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
  // Add other necessary fields here
});

// If you have any pre-save hooks or methods, you can add them here
UserSchema.pre('save', function(next) {
  // Any logic you need before saving the user
  next();
});

module.exports = mongoose.model('User', UserSchema);
