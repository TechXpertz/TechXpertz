const pool = require('../../db');
const { getUserId } = require('../users/helper');
const { isExpert } = require('../users/accountType');

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
    if (accepted.error) {
      return res.status(403).json(accepted.error);
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
  if (declined.error) {
    return res.status(403).json(declined.error);
  } else {
    return res.sendstatus(200);
  }

}

const accept = async (userId, bookingId) => {

  const update = await pool.query(
    'UPDATE bookings SET is_confirmed = true WHERE user_id = $1 AND booking_id = $2 '
    + 'RETURNING booking_id',
    [userId, bookingId]
  );

  if (update.rowCount === 0) {
    return { error: 'No such booking' };
  } else {
    return;
  }

}