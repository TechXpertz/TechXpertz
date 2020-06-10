const express = require('express');
const app = express();
const cors = require('cors');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: 'backend/.env' });
}

// middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/', require('./routes/general'));
app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));

// Register and login routes
const { port } = require('./config');


// Start server 
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});