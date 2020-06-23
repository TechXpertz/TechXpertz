require('../../config');
const chai = require('chai');
const { cleanUp, generateTestUsers, getResetVal, insertManyUnmatchedBookings } = require('../matching/helper');
const { addBookingProgLanguages, addTimeslots } = require('../../controllers/bookings/createBooking')
const expect = chai.expect;
const { getTimeslotsIn, getBookingsIn, delay } = require('./helper');
const pool = require('../../db');
const { task, realSchedule } = require('../../controllers/cronJobs/schedule');
const { matches } = require('../matching/helper');

describe('real schedule', async () => {

  let auth0Ids = [];
  let userIds = [];
  let bookingIds = [];
  let resetVal = [];

  before(async () => {

    const { userIds: users, auth0Ids: auth0s } = await generateTestUsers(4);
    userIds = users;
    auth0Ids = auth0s;

    resetVal = await getResetVal();

    bookingIds = await insertManyUnmatchedBookings(
      5,
      [userIds[0], userIds[0], userIds[1], userIds[2], userIds[3]],
      [1, 1, 2, 1, 2],
      [false, false, false, false, false]);
    await addTimeslots(bookingIds[0], [
      {
        date: '24/06/2020',
        timings: ['1:00AM', '9:00AM', '11:00AM']
      }
    ]);
    await addBookingProgLanguages(bookingIds[0], [
      {
        progName: 'Java'
      },
      {
        progName: 'JavaScript'
      }
    ]);

    await addTimeslots(bookingIds[1], [
      {
        date: '24/06/2020',
        timings: ['9:00 AM', '11:00AM']
      }
    ]);
    await addBookingProgLanguages(bookingIds[1], [
      {
        progName: 'Java'
      },
      {
        progName: 'JavaScript'
      }
    ]);

    await addTimeslots(bookingIds[2], [
      {
        date: '24/06/2020',
        timings: ['1:00AM']
      }
    ]);
    await addBookingProgLanguages(bookingIds[2], [
      {
        progName: 'Java'
      },
    ]);

    await addTimeslots(bookingIds[3], [
      {
        date: '24/06/2020',
        timings: ['9:00AM']
      }
    ]);
    await addBookingProgLanguages(bookingIds[3], [
      {
        progName: 'Java'
      },
    ]);

    await addTimeslots(bookingIds[4], [
      {
        date: '24/06/2020',
        timings: ['9:00AM']
      }
    ]);
    await addBookingProgLanguages(bookingIds[4], [
      {
        progName: 'Java'
      },
    ]);

    const bookings = await getBookingsIn(bookingIds);
    const timeslots = await getTimeslotsIn(bookingIds);
    console.log('bookings: ', bookings);
    console.log('timeslots: ', timeslots);

  });

  it('runs task every 2h', async () => {
    console.log('run task');
    task(realSchedule).start();
  });

  delay(300000);

  after(async () => {

    console.log('matches', matches);
    matches.splice(0);
    cleanUp(auth0Ids, resetVal);
    console.log('cleaned up');

  });

});