const pool = require("../../db");

const getNearestEvenMin = () => {

  const now = new Date(Date.now());
  let nextMinute;
  nextMinute = now.getMinutes() % 2 === 0
    ? now.getMinutes() + 2
    : now.getMinutes() + 1;
  now.setMinutes(nextMinute);
  now.setSeconds(0);
  return now;

};

const getTimeslots = async () => {
  return (await pool.query(
    'SELECT * FROM timeslots'
  ))
    .rows;
}

const getBookings = async () => {
  return (await pool.query(
    'SELECT * FROM bookings'
  ))
    .rows;
}

const getBookingsIn = async (bookingIds) => {
  return (await pool.query(
    'SELECT * FROM bookings WHERE booking_id = ANY($1) ORDER BY booking_id',
    [bookingIds]
  ))
    .rows;
}

const getTimeslotsIn = async (bookingIds) => {
  return (await pool.query(
    'SELECT * FROM timeslots WHERE booking_id = ANY($1) ORDER BY (date_col, time_start)',
    [bookingIds]
  ))
    .rows;
}

function delay(interval) {
  return it('should delay', done => {
    setTimeout(() => done(), interval)
  }).timeout(interval + 100);
}

module.exports = {
  getNearestEvenMin,
  getTimeslots,
  getBookings,
  delay,
  getBookingsIn,
  getTimeslotsIn
};