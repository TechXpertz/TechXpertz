const pool = require('../../db');

const getResetVal = async () => {
  const max = await pool.query('SELECT MAX(booking_id) FROM bookings');
  return max.rowCount === 0 ? 1 : max.rows[0].max + 1;
}

const insertTestUsers = async (auth0Ids) => {
  const userIds = [];
  for (const auth0Id of auth0Ids) {
    const userId = (await pool.query(
      'INSERT INTO users (auth0_id) VALUES ($1) RETURNING user_id',
      [auth0Id]
    ))
      .rows[0]
      .user_id;
    userIds.push(userId);
  }
  return userIds;
}

const generateTestUsers = async (numOfUsers) => {
  const auth0Ids = [];
  for (let i = 0; i < numOfUsers; i++) {
    auth0Ids.push('user' + i.toString());
  }
  const userIds = await insertTestUsers(auth0Ids);
  return { userIds, auth0Ids };
}

const insertBooking = async (userId, topicId, otherIsExpert, otherBookingId) => {
  const bookingId = (await pool.query(
    'INSERT INTO bookings (user_id, topic_id, other_is_expert, other_booking_id) '
    + 'VALUES ($1, $2, $3, $4) RETURNING booking_id',
    [userId, topicId, otherIsExpert, otherBookingId]
  ))
    .rows[0]
    .booking_id;
  return bookingId;
}

const insertUnmatchedBooking = async (userId, topicId, otherIsExpert) => {
  const bookingId = (await pool.query(
    'INSERT INTO bookings (user_id, topic_id, other_is_expert) '
    + 'VALUES ($1, $2, $3) RETURNING booking_id',
    [userId, topicId, otherIsExpert]
  ))
    .rows[0]
    .booking_id;
  return bookingId;
}

const insertManyBookings = async (numOfBookings, userIds, topicIds, otherIsExperts, otherBookingIds) => {
  const bookingIds = [];
  for (let i = 0; i < numOfBookings; i++) {
    const bookingId = await insertBooking(userIds[i], topicIds[i], otherIsExperts[i], otherBookingIds[i]);
    bookingIds.push(bookingId);
  }
  return bookingIds;
}

const insertManyUnmatchedBookings = async (numOfBookings, userIds, topicIds, otherIsExperts) => {
  const bookingIds = [];
  for (let i = 0; i < numOfBookings; i++) {
    const bookingId = await insertUnmatchedBooking(userIds[i], topicIds[i], otherIsExperts[i]);
    bookingIds.push(bookingId);
  }
  return bookingIds;
}

const insertSameTimeslots = async (bookingIds, date, time) => {

  for (const bookingId of bookingIds) {
    await pool.query(
      'INSERT INTO timeslots (booking_id, date_col, time_start) VALUES ($1, $2, $3)',
      [bookingId, date, time]
    );
  }

}

const insertBookingProgLang = async (bookingId, progIds) => {
  for (const progId of progIds) {
    await pool.query(
      'INSERT INTO booking_prog_languages (booking_id, prog_id) VALUES ($1, $2)',
      [bookingId, progId]
    );
  }
}

const setUpMatchingTest1 = async () => {
  console.log('inserting users');
  const users = await generateTestUsers(10);
  const auth0Ids = users.auth0Ids;
  const userIds = users.userIds;

  console.log('inserting bookings');
  const resetVal = await getResetVal();
  const topicIds = [3, 2, 2, 2, 1, 4, 4, 4, 4, 4];
  const bookingIds = [];
  for (let i = 0; i < 10; i++) {
    bookingIds.push(await insertUnmatchedBooking(userIds[i], topicIds[i], false));
  }

  console.log('inserting programming languages');
  const progIds = [[3], [1], [2], [2], [1], [1, 2, 3], [2, 3], [1], [3], [4]];
  for (let i = 0; i < 10; i++) {
    await insertBookingProgLang(bookingIds[i], progIds[i]);
  }
  return { auth0Ids, userIds, bookingIds, resetVal };
};

const deleteTestUsers = async (auth0Ids) => {
  for (const auth0Id of auth0Ids) {
    await pool.query('DELETE FROM users WHERE auth0_id = $1',
      [auth0Id]);
  }
}

const resetBookingPK = async (resetVal) => {
  await pool.query("SELECT SETVAL((SELECT pg_get_serial_sequence('bookings', 'booking_id')), $1, false)",
    [resetVal]);
}

const cleanUp = async (auth0Ids, resetVal) => {
  await deleteTestUsers(auth0Ids);
  await resetBookingPK(resetVal);
}

const checkPartnersInDb = async (bookingA, bookingB) => {

  const isPartner = async (bookingA, bookingB) => {
    const partnerOfA = (await pool.query(
      'SELECT other_booking_id FROM bookings WHERE booking_id = $1',
      [bookingA]
    ))
      .rows[0]
      .other_booking_id;
    return partnerOfA === bookingB;
  }

  return (await isPartner(bookingA, bookingB)) && (await isPartner(bookingB, bookingA));

};

let matches = [];

module.exports = {
  getResetVal,
  insertTestUsers,
  generateTestUsers,
  insertBooking,
  insertUnmatchedBooking,
  insertSameTimeslots,
  setUpMatchingTest1,
  cleanUp,
  matches,
  checkPartnersInDb,
  deleteTestUsers,
  insertManyUnmatchedBookings,
  insertBookingProgLang
}



