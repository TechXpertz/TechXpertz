require('../../config');
const chai = require('chai');
const { getNextTimeslot, toISO, add2Minutes } = require('../../controllers/cronJobs/cronHelpers');
const { setUpMatchingTest1, insertTestUsers, insertBooking, insertUnmatchedBooking, insertSameTimeslots, cleanUp } = require('../matchingTests/helper');
const expect = chai.expect;
const { getNearestEvenMin, getTimeslots, getBookings } = require('./helper');
const pool = require('../../db');
const { task } = require('../../controllers/cronJobs/schedule');
const { matches } = require('../matchingTests/helper');

describe('schedule', async () => {

  let auth0Ids = [];
  let userIds = [];
  let bookingIds = [];
  let resetVal = [];

  function delay(interval) {
    return it('should delay', done => {
      setTimeout(() => done(), interval)
    }).timeout(interval + 100);
  }

  before(async () => {

    const now = getNearestEvenMin();
    const next = add2Minutes(now);
    const firstCycle = { now: toISO(now), next: toISO(next) };
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
    const firstNowUserIds = await insertTestUsers(firstNowAuth0Ids);

    // firstCycle.now bookings
    const firstNowBookingIds = [];
    for (i in firstNowUserIds) {
      if (firstNowAuth0Ids[i] === 'now1') {
        firstNowBookingIds.push(await insertBooking(firstNowUserIds[i], 1, false, 1));
      } else {
        firstNowBookingIds.push(await insertUnmatchedBooking(firstNowUserIds[i], 1, false));
      }
    }

    console.log('initial bookings', await getBookings());

    // firstCycle.now timeslots
    await insertSameTimeslots(firstNowBookingIds, firstCycle.now.date, firstCycle.now.time);

    auth0Ids = firstNowAuth0Ids.concat(firstNextAuth0Ids);
    userIds = firstNowUserIds.concat(firstNextUserIds);
    bookingIds = firstNowBookingIds.concat(firstNextBookingIds);

    console.log('timeslots before', await getTimeslots());

  });

  it('does matching every 1 minute', async () => {

    task.start();

  });

  delay(120000);

  after(async () => {

    console.log('matches', matches);
    console.log('timeslots', await getTimeslots());
    matches.splice(0);
    await cleanUp(auth0Ids, resetVal);
    console.log('cleaned up');

  });

});

