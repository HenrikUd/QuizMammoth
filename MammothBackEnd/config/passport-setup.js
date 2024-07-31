require('dotenv').config({ path: __dirname + '/././../../.env' });
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user-model');


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => done(null, user))
        .catch(err => done(err, null));
});

passport.use(new GoogleStrategy({
    callbackURL: 'https://mammothbackend.vercel.app/api/auth/google/redirect',
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
}, (accessToken, refreshToken, profile, done) => {
    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);

    const email = profile.emails && profile.emails[0].value ? profile.emails[0].value : null;


    User.findOne({ googleId: profile.id })
        .then(currentUser => {
            if (currentUser) {
                console.log('User found:', currentUser);
                done(null, currentUser);
            } else {
                new User({
                    username: profile.displayName,
                    googleId: profile.id,
                    email: email,
                    accessToken: accessToken,  // Optional
                    refreshToken: refreshToken // Optional
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
}));

module.exports = passport;
