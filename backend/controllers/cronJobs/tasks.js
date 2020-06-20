const pool = require('../../db');

const deleteUnmatchedBookingsAt = async (datetime) => {

  let { date, time } = datetime;
  await pool.query(
    'DELETE FROM timeslots WHERE '
    + 'date_col = $1 '
    + 'AND time_start = $2 '
    + 'AND booking_id IN '
    + '(SELECT booking_id FROM bookings WHERE other_booking_id IS NULL)',
    [date, time]
  );

};

const sendFailureEmail = (bookingId) => {
  console.log('send failure email to', bookingId);
}

const sendSuccessEmail = (bookingId) => {
  console.log('send success email to', bookingId);
}

module.exports = {
  deleteUnmatchedBookingsAt,
  sendFailureEmail,
  sendSuccessEmail
}