const express = require('express');
const router = express.Router();
const Answer  = require('./models/Answers'); 

// Endpoint to save answers to a quiz for a user
router.post('/:userId/answers', async (req, res) => {
  const { uuid, answers } = req.body;

  console.log("Received data:", { uuid, answers });

  try {
    const answer = new Answer({ uuid, answers });
    console.log("Saving answer:", answer);
    await answer.save();
    res.status(200).json({ message: 'Answers saved successfully', answer });
  } catch (error) {
    console.error('Error saving answer:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Endpoint to get all answers for a user
router.get('/:userId/answers/all', async (req, res) => {

  try {
    const answers = await Answer.find()
    res.status(200).json(answers);
  } catch (error) {
    console.error('Error fetching answers:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Endpoint to delete an answer by UUID
router.delete('/:userId/answers', async (req, res) => {
  const { uuid } = req.query; // Get UUID from query parameters

  if (!uuid) {
    return res.status(400).json({ message: 'UUID parameter is required' });
  }

  try {
    const answer = await Answer.findOneAndDelete({ uuid });

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    res.status(200).json({ message: 'Answer deleted successfully' });
  } catch (error) {
    console.error('Error deleting answer', error);
    res.status(500).json({ message: 'Server error', error });
  }
});


module.exports = router;
