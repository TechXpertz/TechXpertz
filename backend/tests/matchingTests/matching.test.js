require('../../config');
const pool = require('../../db');
const chai = require('chai');
// const expect = chai.expect;
const { normalNormalMatching } = require('../../controllers/matching/matching');
const { cleanUp, setUpMatchingTest1, checkPartnersInDb } = require('./helper');
const { matches } = require('./helper');
const { expect } = require('chai');

describe('normal-normal matching', async () => {

  let bookingIds = [];
  let resetVal;
  let auth0Ids = [];
  let userIds = [];

  before(async () => {

    const { auth0Ids: auth0, userIds: users, bookingIds: bookings, resetVal: resetValue } =
      await setUpMatchingTest1();
    auth0Ids = auth0;
    userIds = users;
    bookingIds = bookings;
    resetVal = resetValue;

  });

  it('do normal-normal matching', async () => {

    const leftover = await normalNormalMatching(bookingIds);
    console.log('matches', matches);
    const result = matches;
    const expectedMatches = [
      new Set([bookingIds[2], bookingIds[3]]),
      new Set([bookingIds[5], bookingIds[7]]),
      new Set([bookingIds[6], bookingIds[8]]),
      new Set([bookingIds[1], bookingIds[4]]),
      new Set([bookingIds[0], bookingIds[9]])
    ];
    expect(leftover).to.equal(undefined);
    expect(result).to.eql(expectedMatches);

    expectedMatches.forEach(
      async set => {
        const iter = set.values();
        const bookingA = iter.next().value;
        const bookingB = iter.next().value;
        const arePartners = await checkPartnersInDb(bookingA, bookingB);
        expect(arePartners).to.equal(true);
      }
    )

  });

  after(async () => {

    matches.splice(0);
    await cleanUp(auth0Ids, resetVal);

  });
});