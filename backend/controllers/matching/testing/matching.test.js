require('../../../config');
const pool = require('../../../db');
const chai = require('chai');
const expect = chai.expect;
const { normalNormalMatching } = require('../matching');

describe('normal-normal matching', async () => {

  const userIds = [];
  const bookingIds = [];
  let resetVal;

  before(async () => {

    const auth0Ids = [];
    for (let i = 0; i < 10; i++) {
      auth0Ids.push('user' + i.toString());
    }

    console.log('inserting users');
    for (const auth0Id of auth0Ids) {
      const userId = (await pool.query(
        'INSERT INTO users (auth0_id) VALUES ($1) RETURNING user_id',
        [auth0Id]
      ))
        .rows[0]
        .user_id;
      userIds.push(userId);
    }

    const insertBooking = async (userId, topicId) => {
      const bookingId = (await pool.query(
        'INSERT INTO bookings (user_id, topic_id, other_is_expert) VALUES ($1, $2, false) '
        + 'RETURNING booking_id',
        [userId, topicId]
      ))
        .rows[0]
        .booking_id;
      return bookingId;
    }

    console.log('inserting bookings');
    const max = await pool.query('SELECT MAX(booking_id) FROM bookings');
    resetVal = max.rowCount === 0 ? 1 : max.rows[0].max + 1;
    const topicIds = [3, 2, 2, 2, 1, 4, 4, 4, 4, 4];

    for (let i = 0; i < 10; i++) {
      bookingIds.push(await insertBooking(userIds[i], topicIds[i]));
    }

    const insertBookingProgLang = async (bookingId, progIds) => {
      for (const progId of progIds) {
        await pool.query(
          'INSERT INTO booking_prog_languages (booking_id, prog_id) VALUES ($1, $2)',
          [bookingId, progId]
        );
      }
    }

    console.log('inserting programming languages');
    const progIds = [[3], [1], [2], [2], [1], [1, 2, 3], [2, 3], [1], [3], [4]];
    for (let i = 0; i < 10; i++) {
      await insertBookingProgLang(bookingIds[i], progIds[i]);
    }

  });

  it('do normal-normal matching', async () => {

    normalNormalMatching(bookingIds);

  });

  after(async () => {

    for (const userId of userIds) {
      await pool.query(
        'DELETE FROM users WHERE user_id = $1',
        [userId]
      );
    }

    await pool.query("SELECT SETVAL((SELECT pg_get_serial_sequence('bookings', 'booking_id')), $1, false)",
      [resetVal]);

  });





});

