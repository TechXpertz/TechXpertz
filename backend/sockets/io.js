const { auth_config } = require('../config');
const { getUserId } = require('../controllers/users/helper');
const pool = require('../db');
const { server } = require('../server');

const socketio = require('socket.io');
const io = socketio(server, {
  handlePreflightRequest: (req, res) => {
    const headers = {
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Origin": 'http://localhost:3000',
      "Access-Control-Allow-Credentials": true
    };
    res.writeHead(200, headers);
    res.end();
  }
});

const jwt = require('jsonwebtoken');
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

const ioAuth = (socket, next) => {
  const bookingId = socket.handshake.query.bookingId;
  const token = socket.handshake.headers.authorization.split(' ')[1];
  jwt.verify(token, getKey, jwtOptions, async function (err, decoded) {
    if (err) {
      return next(err);
    }

    const userId = await getUserId(decoded);

    // check if user has this bookingId
    const partner = await pool.query(
      'SELECT other_booking_id FROM bookings WHERE '
      + 'user_id = $1 AND booking_id = $2',
      [userId, bookingId]
    );

    if (partner.rowCount === 0) {
      return next(new Error('Unauthorized to enter room'));
    }
    const otherBookingId = partner.rows[0].other_booking_id;
    if (otherBookingId === null) {
      return next(new Error('No partner available'));
    }

    // check if this booking is happening now (with 15 min grace)
    const timeslotsRes = await pool.query(
      'SELECT date_col, time_start FROM timeslots '
      + 'WHERE booking_id = $1 '
      + 'ORDER BY (date_col, time_start)',
      [bookingId]
    );

    if (timeslotsRes.rowCount === 0) {
      return next(new Error('No bookings happening now'));
    }

    const timeslot = timeslotsRes.rows[0];
    const now = new Date(Date.now())
    const { date_col: dbDate, time_start: timeStart } = timeslot;
    let [hour, min, sec] = timeStart.split(':');
    hour = parseInt(hour);
    min = parseInt(min);
    dbDate.setHours(hour);
    dbDate.setMinutes(min);
    const start = new Date(dbDate);
    start.setMinutes(min - 15);
    const end = new Date(dbDate);
    end.setMinutes(min + 15);
    end.setHours(hour + 2);
    if (now < start || now > end) {
      return next(new Error('No bookings happening now'));
    }

    // create a room with this format "<smaller-bookingId>,<larger-bookingId>"
    const smaller = Math.min(bookingId, otherBookingId);
    const larger = Math.max(bookingId, otherBookingId);
    const room = `${smaller},${larger}`;
    socket.join(room);
    socket.to(room).emit('message', 'user has joined the room');
    return next();
  });
}

const editor = io.of('/editor');

module.exports = {
  editor,
  ioAuth
};

require('./editor');

