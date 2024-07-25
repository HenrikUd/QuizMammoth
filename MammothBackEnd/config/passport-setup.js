const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy; // Import GoogleStrategy properly
const keys = require('./keys');
const User = require('../models/user-model');

// Serialize user into session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => done(null, user))
        .catch(err => done(err, null));
});

// Configure Google OAuth 2.0 strategy
passport.use(
    new GoogleStrategy({
        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        // Check if user already exists in our db
        User.findOne({ googleId: profile.id })
            .then(currentUser => {
                if (currentUser) {
                    // User already exists
                    console.log('User found:', currentUser);
                    done(null, currentUser);
                } else {
                    // Create new user in our db
                    new User({
                        username: profile.displayName,
                        googleId: profile.id
                    }).save()
                        .then(newUser => {
                            console.log('New user created:', newUser);
                            done(null, newUser);
                        })
                        .catch(err => {
                            console.error('Error creating new user:', err);
                            done(err, null);
                        });
                }
            })
            .catch(err => {
                console.error('Error finding user:', err);
                done(err, null);
            });
    })
);

module.exports = passport;