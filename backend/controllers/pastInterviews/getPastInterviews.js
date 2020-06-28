const pool = require('../../db');
const { getUserId } = require('../users/helper');
const { getAllBookingsOfUser } = require('../bookings/getBookings');

const getPastInterviews = async (req, res) => {

  if (!req.user) {
    return res.sendStatus(401);
  }

  const userId = await getUserId(req.user);
  const pastInterviews = await pastInterviewsOf(userId);
  return res.status(200).json(pastInterviews);

}

const pastInterviewsOf = async (userId) => {

  const userBookings = await getAllBookingsOfUser(userId);
  const bookings = userBookings.map(booking => booking.booking_id);
  const pastInterviews = await getPastInterviewsInBookings(bookings);
  return { pastInterviews };

}

const getPastInterviewsInBookings = async (userBookings) => {

  const bookings = await pool.query(
    'SELECT * FROM past_interviews WHERE booking_id = ANY($1)',
    [userBookings]
  );
  return bookings.rows.map(booking => {
    return {
      bookingId: booking.booking_id,
      questionId: booking.question_id
    }
  })
}

module.exports = {
  getPastInterviews
}