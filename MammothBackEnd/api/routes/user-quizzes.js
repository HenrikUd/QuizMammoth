const express = require('express');
const router = express.Router();
const Quiz = require('../../models/Quiz'); // Ensure correct path to quiz model

// Endpoint to save a quiz to a user's profile

router.post('/:userId/quizzes', async (req, res) => {
  const { userId } = req.params;
  const { uuid, quizzes } = req.body;

  console.log("Received data:", { userId, uuid, quizzes });

  try {
    const quiz = new Quiz({ userId, uuid, quizzes });
    console.log("Saving quiz:", quiz);
    await quiz.save();
    res.status(200).json({ message: 'Quiz saved successfully', quiz });
  } catch (error) {
    console.error('Error saving quiz:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Endpoint to get all quizzes for a user
router.get('/:userId/quizzes/all', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Endpoint to delete a quiz by UUID
router.delete('/:userId/quizzes', async (req, res) => {
  try {
    const { uuid } = req.query; // Get UUID from query parameters

    if (!uuid) {
      return res.status(400).json({ message: 'UUID parameter is required' });
    }

    const quiz = await Quiz.findOneAndDelete({ uuid });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
