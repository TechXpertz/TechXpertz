const express = require('express');
const app = express();
const cors = require('cors');
const { port } = require('./config');
const passport = require('passport');
const cookieSession = require('cookie-session');
require('./passport-setup');

// middleware
app.use(express.json());
app.use(cors());

app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'],
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', require('./routes/general'));
app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));

// Register and login routes

// Start server 
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
