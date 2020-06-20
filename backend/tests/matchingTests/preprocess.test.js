require('../../config');
const chai = require('chai');
const expect = chai.expect;
const { preprocessBookings } = require('../../controllers/matching/preprocess');
const { getResetVal,
  insertBooking,
  insertUnmatchedBooking,
  insertSameTimeslots,
  cleanUp,
  generateTestUsers } = require('./helper');

describe('preprocess bookings', () => {

  const date = '2020-06-17';
  const time = '6:00 PM';
  const expected = {
    normalNormals: [],
    normalExperts: []
  };
  let resetVal = 1;
  let auth0Ids;
  let userIds;

  before(async () => {

    resetVal = await getResetVal();
    users = await generateTestUsers(5);
    auth0Ids = users.auth0Ids;
    userIds = users.userIds;

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

