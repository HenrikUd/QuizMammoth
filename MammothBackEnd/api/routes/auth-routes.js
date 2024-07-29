const router = require('express').Router();
const passport = require('passport');

// Auth login
router.get('/login', (req, res) => {
    res.render('login', { user: req.user });
});

// Auth logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// Auth with Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile'],
    prompt: 'select_account',
}));

// Callback route for Google to redirect to
router.get('/google/redirect', (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
        if (err) {
            console.error('Google Authentication Error:', err);
            return res.status(500).send('An error occurred during authentication.');
        }
        if (!user) {
            console.error('Google Authentication Failed:', info);
            return res.status(401).send('Authentication failed.');
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error('Login Error:', err);
                return res.status(500).send('An error occurred during login.');
            }
            // Redirect to the frontend app after successful login
            console.log('user logged in');
            return res.redirect('https://quiz-mammoth.vercel.app');
        });
    })(req, res, next);
});

// Route to check if user is logged in and get user info
router.get('/home', (req, res) => {
    const user = req.user;
    res.json({ user });
});

module.exports = router;
