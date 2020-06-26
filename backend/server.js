const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);
const cors = require('cors');
const socketio = require('socket.io');
const io = socketio(server);
const jwt = require('jsonwebtoken');
const Pusher = require('pusher');
const { auth_config } = require('./config');

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
app.use('/info', require('./routes/info'));
app.use('/bookings', require('./routes/bookings'));

const jwtOptions = {
  audience: auth_config.audience,
  issuer: `https://${auth_config.domain}/`,
  algorithms: ['RS256'],
};

const jwksClient = require('jwks-rsa');
const client = jwksClient({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: `https://${auth_config.domain}/.well-known/jwks.json`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// io.use((socket, next) => {
//   const token = socket.handshake.query.token;
//   jwt.verify(token, getKey, jwtOptions, function (err, decoded) {
//     if (!err) {
//       next();
//     }
//   });
// })

// io.on('connection', socket => {
//   console.log('connected');
//   socket.emit('message', 'welcome!');
// });

const { port } = require('./config');

// Start server
server.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

// const { task } = require('./controllers/cronJobs/schedule');
// task.start();