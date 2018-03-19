const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

dotenv.config();

const port = process.env.PORT || 3000;

// ////////////////////////////////////////////////////////////////////////////
//
// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session. In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing. However, due to the fact that this
// example does not have a database, the complete Google profile is serialized
// and deserialized.
//
passport.serializeUser((user, done) => {
  // done(null, user.id);
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Configure the Google strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Third Party API (Google) on
// the user's behalf, along with the user's profile. The function must invoke
// `done` with a user object, which will be set at `req.user` in route handlers
// after authentication.
//
//   See http://passportjs.org/docs/configure#verify-callback
passport.use(
  new GoogleStrategy(
    // The OAuth 2 client ID and secret from https://console.developers.google.com
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://127.0.0.1:3000/auth/google/callback',
    },

    (accessToken, refreshToken, profile, done) =>
      // In this example, the user's Google profile is supplied as the user
      // record.
      // In a production-quality application, the Google profile should
      // be associated with a user record in the application's database, which
      // allows for account linking and authentication with other identity
      // providers.
      done(null, profile)
  )
);

// Route middleware to ensure user is authorized
const isAuthorized = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  res.redirect('/login');
};

// ////////////////////////////////////////////////////////////////////////////
//
// Express app
//
//
// Create a new Express application.
const app = express();
// Configure view engine to render Handlebars templates.
app.set('view engine', 'hbs');
// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(logger('dev'));
app.use(cookieParser());
app.use(
  session({
    secret: 'outh2 exampple',
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// ////////////////////////////////////////////////////////
//
// Application routes
//
app.get('/', (req, res) => {
  res.render('index', {
    user: req.user,
  });
});

app.get('/login', (req, res) => {
  res.render('login', {
    user: req.user,
  });
});

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request. The first step in Google authentication will involve
//   redirecting the user to google.com. After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request. If authentication fails, the user will be redirected back to the
//   login page. Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
  }),
  (req, res) => {
    // Authenticated successfully
    res.redirect('/');
  }
);

app.get('/account', isAuthorized, (req, res) => {
  res.render('account', {
    user: req.user,
  });
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`); // eslint-disable-line
});
