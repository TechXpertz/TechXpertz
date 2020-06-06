const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { oauth_client_id, oauth_client_secret } = require('./config');

passport.use(new GoogleStrategy({
    clientID: oauth_client_id,
    clientSecret: oauth_client_secret,
    callbackURL: "/auth/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        done(null, profile);
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});