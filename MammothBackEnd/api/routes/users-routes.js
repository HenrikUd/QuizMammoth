const express = require('express');
const router = express.Router();
const User = require('../../models/user-model.js');
const cors = require('cors');

// Apply CORS middleware to this route
router.get('/:userId', cors(), async (req, res) => {
    console.log('Received request for user:', req.params.userId);
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            console.log('User not found:', req.params.userId);
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('Sending user data:', user);
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Add a catch-all route to log unhandled requests
router.use('*', (req, res) => {
    console.log('Unhandled user route request:', req.method, req.originalUrl);
    res.status(404).json({ message: 'User route not found' });
});

module.exports = router;