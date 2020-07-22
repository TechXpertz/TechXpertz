const pool = require('../../db');
const { getUserId } = require('../users/helper');
const { isExpert } = require('../users/accountType');
const { cancelPartnerBooking } = require('./deleteBooking');

const acceptBooking = async (req, res) => {

  if (!req.user) {
    return res.sendStatus(401);
  }

  const { bookingId } = req.body;
  if (!bookingId) {
    return res.sendStatus(400);
  }

  const userId = await getUserId(req.user);
  const expert = await isExpert(req.user);
  if (!expert) {
    return res.sendStatus(400);
  } else {
    const accepted = await accept(userId, bookingId);
    if (!accepted.success) {
      return res.sendStatus(403);
    } else {
      return res.sendStatus(200);
    }
  }
}

const declineBooking = async (req, res) => {

  if (!req.user) {
    return res.sendStatus(401);
  }

  const { bookingId } = req.body;
  if (!bookingId) {
    return res.sendStatus(400);
  }
  const userId = await getUserId(req.user);
  const expert = await isExpert(req.user);
  if (!expert) {
    return res.sendStatus(400);
  }

  const declined = await decline(userId, bookingId);
  if (!declined.success) {
    return res.sendStatus(403);
  } else {
    return res.sendStatus(200);
  }

}

const accept = async (userId, bookingId) => {

  const update = await pool.query(
    'UPDATE bookings SET is_confirmed = true WHERE user_id = $1 AND booking_id = $2 '
    + 'RETURNING other_booking_id',
    [userId, bookingId]
  );

  if (update.rowCount === 0) {
    return { success: false };
  }

  const otherBookingId = update.rows[0].other_booking_id;
  if (!otherBookingId) {
    return { success: false };
  }

  await pool.query(
    'UPDATE bookings SET is_confirmed = true WHERE booking_id = $1',
    [otherBookingId]
  );
  return { success: true };

}

const decline = async (userId, bookingId) => {

  const otherBookingRes = (await pool.query(
    'DELETE FROM bookings WHERE user_id = $1 AND booking_id = $2 RETURNING other_booking_id',
    [userId, bookingId]
  ));

  if (otherBookingRes.rowCount === 0) {
    return { success: false };
  }

  const otherBookingId = otherBookingRes.rows[0].other_booking_id;
  if (otherBookingId === null) {
    return { success: false };
  }

  const cancelation = await cancelPartnerBooking(otherBookingId);
  if (cancelation.hasRemaining) {
    const { date, timeStart } = cancelation;
    // send cancelled TIMESLOT email
    console.log('delete timeslot', otherBookingId, date, timeStart);
  } else {
    // send cancelled BOOKING email
    console.log('delete booking', otherBookingId);
  }
  return { success: true };

}

module.exports = {
  acceptBooking,
  declineBooking
}