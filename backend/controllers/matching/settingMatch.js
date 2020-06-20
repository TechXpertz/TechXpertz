const pool = require('../../db');
const { matches } = require('../../tests/matchingTests/helper');

const match = async (bookingA, bookingB) => {

  await setOtherBookingId(bookingA, bookingB);
  await setOtherBookingId(bookingB, bookingA);

  // FOR TESTING
  matches.push(new Set([bookingA, bookingB]));

};

const setOtherBookingId = async (bookingA, bookingB) => {

  await pool.query(
    'UPDATE bookings SET other_booking_id = $1 WHERE booking_id = $2',
    [bookingB, bookingA]
  );

}

module.exports = {
  match
}