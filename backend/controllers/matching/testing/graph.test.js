require('../../../config');
const pool = require('../../../db');
const chai = require('chai');
const expect = chai.expect;
const { constructGraph, connectSameTopics } = require('../graph');

describe('graph algorithms', () => {

  const user1 = 'auth0 | user1';
  const user2 = 'auth0 | user2';
  const user3 = 'auth0 | user3';
  const user4 = 'auth0 | user4';
  const auth0Ids = [user1, user2, user3, user4];
  let resetVal = 1;
  const bookingIds = [];

  before(async () => {

    console.log('inserting test users...')
    const userIds = [];
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
    await addProgLanguage(bookingIds[1], 3);
    await addProgLanguage(bookingIds[1], 4);

    // user3
    await addProgLanguage(bookingIds[2], 2);

    // user4
    await addProgLanguage(bookingIds[3], 1);

    console.log('before finished')

  });

  it('constructs a graph for one topic', async () => {

    const graph = await constructGraph(bookingIds);
    console.log(graph);
    expect(graph).to.have.property('edgeList');
    expect(graph).to.have.property('degrees');
    const { edgeList, degrees } = graph;

    const expectedDegrees = new Map();
    expectedDegrees.set(bookingIds[0], 2);
    expectedDegrees.set(bookingIds[1], 3);
    expectedDegrees.set(bookingIds[2], 1);
    expectedDegrees.set(bookingIds[3], 2);

    const expectedEdgeList = [
      new Set([bookingIds[0], bookingIds[1]]),
      new Set([bookingIds[0], bookingIds[3]]),
      new Set([bookingIds[1], bookingIds[2]]),
      new Set([bookingIds[1], bookingIds[3]])
    ];

    console.log(expectedDegrees);
    console.log(expectedEdgeList);

    expect(degrees).to.eql(expectedDegrees);
    expect(edgeList).to.eql(expectedEdgeList);

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