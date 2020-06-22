require('../../config');
const chai = require('chai');
const { getNextTimeslot, toISO, add2Minutes } = require('../../controllers/cronJobs/cronHelpers');
const { setUpMatchingTest1, insertTestUsers, insertBooking, insertUnmatchedBooking, insertSameTimeslots, cleanUp, insertBookingProgLang } = require('../matching/helper');
const expect = chai.expect;
const { getNearestEvenMin, getTimeslotsIn, getBookingsIn } = require('./helper');
const pool = require('../../db');
const { task, every2Minutes } = require('../../controllers/cronJobs/schedule');
const { matches } = require('../matching/helper');
const { addBookingProgLanguages } = require('../../controllers/bookings/createBooking');

const bookingQuery = async (userId) => {
  return await pool.query(
    'SELECT booking_id FROM bookings WHERE user_id = $1',
    [userId]
  );
}

const timeslotQuery = async (bookingId) => {
  return await pool.query(
    'SELECT * FROM timeslots WHERE booking_id = $1',
    [bookingId]
  );
}

describe('schedule', async () => {

  let auth0Ids = [];
  let userIds = [];
  let bookingIds = [];
  let resetVal = [];
  let firstNowUserIds = [];
  let firstNowBookingIds = [];
  let firstCycle;

  function delay(interval) {
    return it('should delay', done => {
      setTimeout(() => done(), interval)
    }).timeout(interval + 100);
  }

  before(async () => {

    const now = getNearestEvenMin();
    const next = add2Minutes(now);
    firstCycle = { now: toISO(now), next: toISO(next) };
    const secondCycle = { now: toISO(next), next: toISO(add2Minutes(next)) };
    console.log('first cycle', firstCycle);

    // firstCycle.next bookings 
    const { auth0Ids: auth0, userIds: users, bookingIds: bookings, resetVal: resetValue }
      = await setUpMatchingTest1();
    firstNextAuth0Ids = auth0;
    firstNextUserIds = users;
    firstNextBookingIds = bookings;
    resetVal = resetValue;

    // firstCycle.next timeslots
    await insertSameTimeslots(firstNextBookingIds, firstCycle.next.date, firstCycle.next.time);

    // firstCycle.now users
    const firstNowAuth0Ids = ['now1', 'now2', 'now3'];
    firstNowUserIds = await insertTestUsers(firstNowAuth0Ids);

    // firstCycle.now bookings
    // now 1 matched already
    firstNowBookingIds.push(await insertBooking(firstNowUserIds[0], 1, false, 1));

    // now 2, unmatched, no more remaining timeslots
    firstNowBookingIds.push(await insertUnmatchedBooking(firstNowUserIds[1], 1, false));

    // now 3, unmatched, has one remaining timeslot
    firstNowBookingIds.push(await insertUnmatchedBooking(firstNowUserIds[2], 2, false));

    auth0Ids = firstNowAuth0Ids.concat(firstNextAuth0Ids);
    userIds = firstNowUserIds.concat(firstNextUserIds);
    bookingIds = firstNextBookingIds.concat(firstNowBookingIds);

    console.log('initial bookings', await getBookingsIn(bookingIds));

    // firstCycle.now timeslots
    await insertSameTimeslots(firstNowBookingIds, firstCycle.now.date, firstCycle.now.time);
    // additional timeslot for now3
    await insertSameTimeslots([firstNowBookingIds[2]], firstCycle.next.date, firstCycle.next.time);
    // add proglanguage for now3
    await insertBookingProgLang(firstNowBookingIds[2], [3]);

    console.log('timeslots before', await getTimeslotsIn(bookingIds));

  });

  it('does matching every 1 minute', async () => {

    task(every2Minutes).start();

  });

  delay(120000);

  it('check results', async () => {

    console.log('now1 booking should still exist');
    const now1Booking = await bookingQuery(firstNowUserIds[0]);
    expect(now1Booking.rowCount).to.equal(1);

    console.log('now1 timeslot should still exist');
    const now1Timeslot = await timeslotQuery(firstNowBookingIds[0]);
    expect(now1Timeslot.rowCount).to.equal(1);

    console.log('now2 booking should not exist');
    const now2Booking = await bookingQuery(firstNowUserIds[1]);
    expect(now2Booking.rowCount).to.equal(0);

    console.log('now3 timeslot at now should not exist but timeslot at next should exist');
    const now2Timeslot = await timeslotQuery(firstNowBookingIds[2]);
    expect(now2Timeslot.rowCount).to.equal(1);
    const { date_col, time_start } = now2Timeslot.rows[0];
    expect(toISO(date_col).date).to.equal(firstCycle.next.date);
    expect(time_start).to.equal(firstCycle.next.time + ':00');

    console.log('matches', matches);
    console.log('bookingIds', bookingIds);
    const expectedMatches = [
      new Set([bookingIds[2], bookingIds[3]]),
      new Set([bookingIds[1], bookingIds[12]]),
      new Set([bookingIds[5], bookingIds[7]]),
      new Set([bookingIds[6], bookingIds[8]]),
      new Set([bookingIds[0], bookingIds[4]])
    ];
    console.log('expected', expectedMatches);
    expect(matches).to.eql(expectedMatches);
    const validBookingIds = bookingIds.slice(0, 10);
    validBookingIds.push(bookingIds[12]);
    console.log('valid', validBookingIds);
    const leftover = validBookingIds.find(booking => matches.every(
      match => !match.has(booking)
    ));
    expect(leftover).to.equal(bookingIds[9]);

  });

  after(async () => {

    matches.splice(0);
    await cleanUp(auth0Ids, resetVal);
    console.log('cleaned up');

  });

});

