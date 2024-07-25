const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
  uuid: { type: String, required: true, unique: true },
  quizzes: {
    questions: [{ type: String }] // Array of strings representing questions
  }
});

const Quiz = mongoose.model('Quiz', QuizSchema);

module.exports = Quiz;
