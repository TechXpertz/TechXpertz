const pool = require('../../db');

const insertComment = async (bookingId, comment, date, timeStamp) => {
  pool.query(
    'INSERT INTO comments (booking_id, comment, date_col, time_stamp) VALUES ($1, $2, $3, $4)',
    [bookingId, comment, date, timeStamp]
  );
}

module.exports = { insertComment }