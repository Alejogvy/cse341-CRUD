const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // We only perform authentication
        return done(null, profile); // Let's go to the GitHub profile directly
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user); // Save the complete profile in the session
});

passport.deserializeUser((user, done) => {
    done(null, user); // Recover the session profile
});

module.exports = passport;