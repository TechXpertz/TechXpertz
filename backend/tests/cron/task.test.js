require('../../config');
const chai = require('chai');
const { generateTestUsers, insertUnmatchedBooking, insertBooking, checkPartnersInDb, cleanUp, getResetVal, insertBookingProgLang } = require('../matching/helper');
const { addTimeslots } = require('../../controllers/bookings/createBooking');
const { doTaskAtTime } = require('../../controllers/cronJobs/schedule');
const { matches } = require('../matching/helper');
const { getBookingsIn, delay, getTimeslotsIn } = require('./helper');
const expect = chai.expect;

describe('Test the actual task', async () => {

  let auth0Ids = [];
  let userIds = [];
  let bookingIds = [];
  let resetVal;
  const yesterday11PM = new Date(2020, 5, 23, 23);
  const today5AM = new Date(2020, 5, 24, 5);
  const today7AM = new Date(2020, 5, 24, 7);

  before(async () => {

    const users = await generateTestUsers(6);
    auth0Ids = users.auth0Ids;
    userIds = users.userIds;
    matches.splice(0);
    resetVal = await getResetVal();

    console.log('insert 1 matched, 2 unmatched bookings for yesterday 11pm');
    console.log('booking 1 have no remaining timeslots');
    bookingIds.push(await insertUnmatchedBooking(userIds[0], 1, false));
    bookingIds.push(await insertBooking(userIds[1], 1, false, 1));
    bookingIds.push(await insertUnmatchedBooking(userIds[2], 1, false));

    for (let i = 0; i < 3; i++) {
      await addTimeslots(bookingIds[i], [{
        date: '23/6/2020',
        timings: ['11:00PM']
      }]);
    }

    await addTimeslots(bookingIds[2], [{
      date: '24/6/2020',
      timings: ['7:00PM']
    }]);

    console.log('insert 3 bookings for today 7am (2 with topic 1, 1 with topic 2)');
    bookingIds.push(await insertUnmatchedBooking(userIds[3], 1, false));
    bookingIds.push(await insertUnmatchedBooking(userIds[4], 1, false));
    bookingIds.push(await insertUnmatchedBooking(userIds[5], 2, false));
    await insertBookingProgLang(bookingIds[3], [1]);
    await insertBookingProgLang(bookingIds[4], [2]);
    await insertBookingProgLang(bookingIds[5], [1]);

    for (let i = 3; i < 6; i++) {
      await addTimeslots(bookingIds[i], [{
        date: '24/6/2020',
        timings: ['7:00AM']
      }]);
    }

  });

  it('Run task', async () => {

    await doTaskAtTime(today5AM);

    delay(1000);

    console.log('yesterday 11pm unmatched booking should be deleted');
    expect((await getBookingsIn([bookingIds[0]])).length).to.equal(0);
    expect((await getBookingsIn([bookingIds[1]])).length).to.equal(1);
    expect((await getBookingsIn([bookingIds[2]])).length).to.equal(1);
    expect((await getTimeslotsIn([bookingIds[2]])).length).to.equal(1);

    console.log('today 7am bookings should have 2 matched, 1 unmatched');
    expect((await checkPartnersInDb(bookingIds[3], bookingIds[4]))).to.equal(true);
    const checkBookingIds = bookingIds.slice(3, 6);
    const leftover = checkBookingIds.find(booking => matches.every(match => !match.has(booking)));
    expect(leftover).to.equal(bookingIds[5]);

  });


  after(async () => {

    await cleanUp(auth0Ids, resetVal);
    matches.splice(0);
    console.log('cleaned up');


  });

})