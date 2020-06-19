require('../../../config');
const pool = require('../../../db');
const chai = require('chai');
const expect = chai.expect;
const { constructGraph, connectWithinGraph } = require('../graph');
const { insertTestUsers, getResetVal, insertUnmatchedBooking, cleanUp } = require('./helper');

describe('graph algorithms', () => {

  const user1 = 'auth0 | user1';
  const user2 = 'auth0 | user2';
  const user3 = 'auth0 | user3';
  const user4 = 'auth0 | user4';
  const user5 = 'auth0 | user5';
  const auth0Ids = [user1, user2, user3, user4, user5];
  let resetVal = 1;
  const bookingIds = [];
  let userIds = [];

  const addProgLanguage = async (bookingId, progId) => {
    await pool.query(
      'INSERT INTO booking_prog_languages (booking_id, prog_id) '
      + 'VALUES ($1, $2)',
      [bookingId, progId]
    )
  };

  before(async () => {

    console.log('inserting test users...')
    userIds = await insertTestUsers(auth0Ids);

    console.log('inserting bookings same topic...');
    resetVal = await getResetVal();

    for (const userId of userIds) {
      const bookingId = await insertUnmatchedBooking(userId, 1, false);
      bookingIds.push(bookingId);
    }

    console.log('inserting booking prog languages...');

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

  it('connects bookings within the same topic', async () => {
    await connectWithinGraph(graph);
  });

  it('match same topic, different programming languages', async () => {

    console.log('insert bookings');
    const differentBookings = [];
    for (const user of userIds) {
      const bookingId = await insertUnmatchedBooking(user, 1, false);
      differentBookings.push(bookingId);
    }
    console.log('different bookings', differentBookings);

    // inserting prog languages
    for (let i = 0; i < 4; i++) {
      await addProgLanguage(differentBookings[i], i + 1);
    }

    const graph2 = await constructGraph(differentBookings);
    await connectWithinGraph(graph2);

  });

  after(async () => {

    await cleanUp(auth0Ids, resetVal);

  });

});