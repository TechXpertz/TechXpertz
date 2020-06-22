const pool = require('../../db');
const { getUserId } = require('../users/helper');
const { toISO } = require('../cronJobs/cronHelpers');

const getUpcomingBookings = async (req, res) => {

  if (!req.user) {
    return res.sendStatus(401);
  }

  const userId = await getUserId(req.user);
  res.status(200).json(await getUpcomingBookingsOfUser(userId));

}

const getPastInterviews = async (req, res) => {




}

const getUpcomingBookingsOfUser = async (userId) => {

  const bookings = await getAllBookingsOfUser(userId);
  const bookingRes = await getBookingsAfterNow(bookings);
  return bookingRes;

}

const getAllBookingsOfUser = async (userId) => {

  const bookings = (await pool.query(
    'SELECT * FROM bookings WHERE user_id = $1',
    [userId]
  ))
    .rows;

  return bookings;
}

const getBookingsAfterNow = async (bookings) => {

  const result = [];
  for (booking of bookings) {
    const bookingId = booking.booking_id;
    const timeslotsRes = (await pool.query(
      'SELECT date_col, time_start FROM timeslots WHERE booking_id = $1 '
      + 'AND (date_col > CURRENT_DATE '
      + 'OR (date_col = CURRENT_DATE AND time_start >= CURRENT_TIME)) '
      + 'ORDER BY (date_col, time_start)',
      [bookingId]
    ))
      .rows;

    if (timeslotsRes.length === 0) {
      continue;
    }

    const timeslots = timeslotsRes.map(timeslot => {
      return {
        date: toISO(timeslot.date_col).date,
        timeStart: timeslot.time_start
      }
    });

    const topic = (await pool.query(
      'SELECT topic_name FROM topics WHERE topic_id = $1',
      [booking.topic_id]
    ))
      .rows[0]
      .topic_name;

    const otherAccType = booking.other_is_expert ? 'Expert' : 'Normal';
    const isMatched = booking.other_booking_id === null ? false : true;

    const bookingRes = {
      topic,
      otherAccType,
      isMatched,
      timeslots
    }

    result.push(bookingRes);

  }

  return { bookings: result };

}

module.exports = { getUpcomingBookings };