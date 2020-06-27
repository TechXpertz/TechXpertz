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
      'SELECT date_col, ARRAY_AGG(time_start ORDER BY time_start) FROM timeslots WHERE booking_id = $1 '
      + 'AND (date_col > CURRENT_DATE '
      + 'OR (date_col = CURRENT_DATE AND time_start >= CURRENT_TIME)) '
      + 'GROUP BY (date_col) ORDER BY date_col',
      [bookingId]
    ))
      .rows;

    if (timeslotsRes.length === 0) {
      continue;
    }

    const timeslots = timeslotsRes.map(timeslot => {
      const { date_col, array_agg: timings } = timeslot;
      const parsedTimings = timings.map(parseTimeForFE);
      const date = parseDateForFE(date_col);
      return {
        date,
        timings: parsedTimings
      };
    });

    const topic = (await pool.query(
      'SELECT topic_name FROM topics WHERE topic_id = $1',
      [booking.topic_id]
    ))
      .rows[0]
      .topic_name;

    const progIds = (await pool.query(
      'SELECT prog_id FROM booking_prog_languages WHERE booking_id = $1',
      [bookingId]
    ))
      .rows
      .map(prog => prog.prog_id);

    const progLanguages = (await pool.query(
      'SELECT ARRAY_AGG(prog_name ORDER BY prog_name) FROM prog_languages WHERE prog_id = ANY($1)',
      [progIds]
    ))
      .rows;

    const otherAccType = booking.other_is_expert ? 'Expert' : 'Normal';

    const bookingRes = {
      bookingId,
      topic,
      otherAccType,
      otherBookingId: booking.other_booking_id,
      timeslots,
      langs: progLanguages[0].array_agg
    }

    result.push(bookingRes);

  }

  return { bookings: result };

}

const parseDateForFE = (dbDate) => {
  const year = dbDate.getFullYear();
  const month = dbDate.getMonth();
  const monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const date = dbDate.getDate().toString();
  const day = dbDate.getDay();
  return `${dayArr[day]}, ${date} ${monthArr[month]} ${year}`;
}

const parseTimeForFE = (dbTime) => {
  const [hour, min, second] = dbTime.split(':');
  const hour12 = hour % 12;
  const suffix = parseInt(hour) === hour12 ? 'AM' : 'PM';
  return `${hour12}:${min}${suffix}`;
}

module.exports = { getUpcomingBookings };