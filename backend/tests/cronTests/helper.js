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

module.exports = {
  getNearestEvenMin,
  getTimeslots,
  getBookings
};