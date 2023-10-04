const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

// Estrategia para Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.PROJECT_URL}api/v1/auth/google/callback`,
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    // console.log(request.user, 'hola');
    done(null, profile);
  }
));

// Estrategia para Facebook
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.PROJECT_URL}api/v1/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'email']
  },
  function(accessToken, refreshToken, profile, cb) {
    profile.email = profile._json.email;
    profile.given_name = profile.displayName;
    console.log(profile);
    cb(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

