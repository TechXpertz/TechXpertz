require('../../../config');
const chai = require('chai');
const expect = chai.expect;
const { preprocessBookings } = require('../preprocess');
const { getResetVal,
  insertTestUsers,
  insertBooking,
  insertUnmatchedBooking,
  insertSameTimeslots,
  cleanUp } = require('./helper');

describe('preprocess bookings', () => {

  const auth0Ids = ['auth0 | 1', 'auth0 | 2', 'auth0 | 3', 'auth0 | 4', 'auth0 | 5'];
  const date = '2020-06-17';
  const time = '6:00 PM';
  const expected = {
    normalNormals: [],
    normalExperts: []
  };
  let resetVal = 1;

  before(async () => {

    resetVal = await getResetVal();

    // determine expected response
    // user 1 - booking0, booking1 (booking0 rejected)
    // user 2 - matched booking2 (rejected)
    // user 5 - normal-expert booking
    for (i = 1; i < 5; i++) {
      if (i === 2) {
        continue;
      }
      expected.normalNormals.push(resetVal + i);
    }
    expected.normalExperts.push(resetVal + 5);
    console.log('expected', expected);

    const userIds = await insertTestUsers(auth0Ids);

    // insert test bookings
    const bookingIds = [];
    for (let i = 0; i < 6; i++) {
      if (i === 0) {
        bookingIds.push(await insertUnmatchedBooking(userIds[i], 1, false));
      } else if (i === 2) {
        bookingIds.push(await insertBooking(userIds[i - 1], 1, false, 1));
      } else if (i === 5) {
        bookingIds.push(await insertUnmatchedBooking(userIds[i - 1], 1, true));
      } else {
        bookingIds.push(await insertUnmatchedBooking(userIds[i - 1], 1, false));
      }

    }
    console.log('bookingIds', bookingIds);

    await insertSameTimeslots(bookingIds, date, time);

  });

  it('should preprocess bookings at specified time', async () => {

    await preprocessBookings(date, time)
      .then(res => {
        console.log(res);
        expect(res).to.have.property('normalNormals');
        expect(res).to.have.property('normalExperts');
        expect(res.normalNormals).to.eql(expected.normalNormals);
        expect(res.normalExperts).to.eql(expected.normalExperts);
      });
  });

  after(async () => {

    await cleanUp(auth0Ids, resetVal);

  });

});

