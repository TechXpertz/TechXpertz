const pool = require('../../db');

const preprocessBookings = async (date, time) => {

  const bookingIds = await getBookingIdsAtTimeslot(date, time);
  // console.log('bookingIds', bookingIds);
  const unmatchedBookings = await removeMatchBookings(bookingIds);
  // console.log('unmatchedBookings', unmatchedBookings);
  const uniqueBookings = await filterOutRepeatUsers(unmatchedBookings);
  // console.log('uniqueBookings', uniqueBookings);
  const { normalBookings, expertBookings } = await separateAccType(uniqueBookings);
  console.log('normal', normalBookings);
  console.log('expert', expertBookings);
  const separatedBookings = await separateOtherAccType(normalBookings);
  console.log('separatedBookings', separatedBookings);
  return {
    expertBookings,
    normalNormals: separatedBookings.normalNormals,
    normalExperts: separatedBookings.normalExperts
  };

};

const getBookingIdsAtTimeslot = async (date, time) => {
  const bookingRes = await pool
    .query('SELECT booking_id FROM timeslots WHERE date_col = $1 AND time_start = $2',
      [date, time]);
  return bookingRes.rows.map(booking => booking.booking_id);
};

const removeMatchBookings = async (bookingIds) => {

  return (await pool.query(
    'SELECT booking_id FROM bookings '
    + 'WHERE booking_id = ANY ($1) '
    + 'AND other_booking_id IS NULL',
    [bookingIds]
  ))
    .rows
    .map(booking => booking.booking_id);

}

const filterOutRepeatUsers = async (bookingIds) => {

  const map = new Map();
  for (index in bookingIds) {
    const bookingId = bookingIds[index];
    const user = await pool
      .query('SELECT user_id FROM bookings WHERE booking_id = $1',
        [bookingId]);
    const userId = user.rows[0].user_id;
    if (map.has(userId)) {
      // keep the booking with a larger bookingId
      if (bookingId > map.get(userId)) {
        map.set(userId, bookingId);
      }
    } else {
      map.set(userId, bookingId);
    }
  }

  const bookings = [];
  map.forEach((value) => bookings.push(value));

  return bookings;
};

const separateAccType = async (bookings) => {

  const normalBookings = [];
  const expertBookings = [];

  for (booking of bookings) {

    const userId = (await pool.query(
      'SELECT user_id FROM bookings WHERE booking_id = $1',
      [booking]
    )).rows[0].user_id;

    const isExpert = (await pool.query(
      'SELECT is_expert FROM users WHERE user_id = $1',
      [userId]
    )).rows[0].is_expert;

    if (isExpert) {
      expertBookings.push(booking);
    } else {
      normalBookings.push(booking);
    }
  }

  return {
    normalBookings,
    expertBookings
  }

}

const separateOtherAccType = async (bookings) => {

  const normalNormals = [];
  const normalExperts = [];

  for (index in bookings) {
    const bookingId = bookings[index];
    const otherIsExpert = (await pool
      .query('SELECT other_is_expert FROM bookings WHERE booking_id = $1',
        [bookingId]))
      .rows[0].other_is_expert;
    otherIsExpert ? normalExperts.push(bookingId) : normalNormals.push(bookingId);
  }

  const separatedBookings = { normalNormals, normalExperts };
  return separatedBookings;

};

module.exports = {
  preprocessBookings,
  getBookingIdsAtTimeslot
};