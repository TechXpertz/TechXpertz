require('../../../config');
const pool = require('../../../db');
const chai = require('chai');
const expect = chai.expect;
const { constructGraph, connectSameTopics, Node } = require('../graph');

describe('graph algorithms', () => {

  const user1 = 'auth0 | user1';
  const user2 = 'auth0 | user2';
  const user3 = 'auth0 | user3';
  const user4 = 'auth0 | user4';
  const user5 = 'auth0 | user5';
  const auth0Ids = [user1, user2, user3, user4, user5];
  let resetVal = 1;
  const bookingIds = [];
  const userIds = [];

  before(async () => {

    console.log('inserting test users...')
    for (index in auth0Ids) {
      const auth0Id = auth0Ids[index];
      const userId = (await pool.query(
        'INSERT INTO users (auth0_id) VALUES ($1) RETURNING user_id',
        [auth0Id]
      ))
        .rows[0]
        .user_id;
      userIds.push(userId);
    }

    console.log('inserting bookings same topic...');
    const max = await pool.query('SELECT MAX(booking_id) FROM bookings');
    resetVal = max.rowCount === 0 ? 1 : max.rows[0].max + 1;

    for (index in userIds) {
      const userId = userIds[index];
      const bookingId = (await pool.query(
        'INSERT INTO bookings (user_id, topic_id, other_is_expert) '
        + 'VALUES ($1, 1, false) RETURNING booking_id',
        [userId]
      ))
        .rows[0]
        .booking_id;
      bookingIds.push(bookingId);
    }

    console.log('inserting booking prog languages...');
    const addProgLanguage = async (bookingId, progId) => {
      await pool.query(
        'INSERT INTO booking_prog_languages (booking_id, prog_id) '
        + 'VALUES ($1, $2)',
        [bookingId, progId]
      )
    };
    // user1
    await addProgLanguage(bookingIds[0], 1);
    await addProgLanguage(bookingIds[0], 4);

    // user2
    await addProgLanguage(bookingIds[1], 1);
    await addProgLanguage(bookingIds[1], 2);
    await addProgLanguage(bookingIds[1], 4);

    // user3
    await addProgLanguage(bookingIds[2], 2);

    // user4
    await addProgLanguage(bookingIds[3], 1);

    // user5
    await addProgLanguage(bookingIds[4], 3);

    console.log('before finished')

  });

  let graph;

  it('constructs a graph for one topic', async () => {
    graph = await constructGraph(bookingIds);
  });

  it('connects bookings within the same topic', () => {
    connectSameTopics(graph);
  });

  it('match same topic, different programming languages', async () => {

    console.log('insert bookings');
    const differentBookings = [];
    for (const user of userIds) {
      const bookingId = (await pool.query(
        'INSERT INTO bookings (user_id, topic_id, other_is_expert) VALUES ($1, 1, false) '
        + 'RETURNING booking_id',
        [user]
      ))
        .rows[0]
        .booking_id;
      differentBookings.push(bookingId);
    }
    console.log('different bookings', differentBookings);

    // inserting prog languages
    for (let i = 0; i < 4; i++) {
      await pool.query(
        'INSERT INTO booking_prog_languages (booking_id, prog_id) VALUES ($1, $2)',
        [differentBookings[i], i + 1]
      );
    }

    const graph2 = await constructGraph(differentBookings);
    connectSameTopics(graph2);

  });

  after(async () => {

    for (index in auth0Ids) {
      const auth0Id = auth0Ids[index];
      await pool.query(
        'DELETE FROM users WHERE auth0_id = $1',
        [auth0Id]
      );
    }

    await pool.query("SELECT SETVAL((SELECT pg_get_serial_sequence('bookings', 'booking_id')), $1, false)",
      [resetVal]);

  });

});