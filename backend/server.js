const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const cors = require('cors');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: 'backend/.env' });
}

// middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api', require('./routes/general'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/info', require('./routes/info'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/feedback', require('./routes/feedbacks'));

const { port } = require('./config');

// Start server
server.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

const { realTask } = require('./controllers/cronJobs/schedule');
realTask.start();

module.exports = {
  server
}

require('./sockets/io');