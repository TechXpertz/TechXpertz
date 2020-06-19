require('../../../config');
const pool = require('../../../db');
const chai = require('chai');
// const expect = chai.expect;
const { normalNormalMatching } = require('../matching');
const { getResetVal,
  insertTestUsers,
  insertUnmatchedBooking,
  cleanUp } = require('./helper');

describe('normal-normal matching', async () => {

  let userIds = [];
  const bookingIds = [];
  let resetVal;
  const auth0Ids = [];
  for (let i = 0; i < 10; i++) {
    auth0Ids.push('user' + i.toString());
  }

  before(async () => {

    console.log('inserting users');
    userIds = await insertTestUsers(auth0Ids);

    console.log('inserting bookings');
    resetVal = await getResetVal();
    const topicIds = [3, 2, 2, 2, 1, 4, 4, 4, 4, 4];
    for (let i = 0; i < 10; i++) {
      bookingIds.push(await insertUnmatchedBooking(userIds[i], topicIds[i], false));
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

    await normalNormalMatching(bookingIds);

  });

  after(async () => {

    await cleanUp(auth0Ids, resetVal);

  });
});