require('../../../config');
const pool = require('../../../db');
const chai = require('chai');
const expect = chai.expect;
const { preprocessBookings } = require('../preprocess');

describe('preprocess bookings', () => {

  const auth0Ids = ['auth0 | 1', 'auth0 | 2', 'auth0 | 3', 'auth0 | 4', 'auth0 | 5'];
  const date = '2020-06-17';
  const time = '6:00 PM';
  const bookings = [];
  const expected = {
    normalNormals: [],
    normalExperts: []
  };
  let resetVal = 1;

  before(async () => {

    // determine expected response
    const max = await pool.query('SELECT MAX(booking_id) FROM bookings');
    const start = max.rowCount === 0 ? 1 : max.rows[0].max + 1;
    resetVal = start;
    for (i = 1; i < 5; i++) {
      expected.normalNormals.push(start + i);
    }
    expected.normalExperts.push(start + 5);

    // insert test users
    const userIds = [];
    for (index in auth0Ids) {
      const auth0Id = auth0Ids[index];
      const userId = (await pool
        .query('INSERT INTO users (auth0_id) VALUES ($1) RETURNING user_id',
          [auth0Id]))
        .rows[0].user_id;
      userIds.push(userId);
    }

    // insert test bookings
    for (i in userIds) {
      // last user is normalExpert
      const userId = userIds[i];
      if (parseInt(i) === userIds.length - 1) {
        const bookingId = (await pool.query(
          'INSERT INTO bookings (user_id, topic_id, other_is_expert) VALUES ($1, 1, true)'
          + 'RETURNING booking_id',
          [userId]
        ))
          .rows[0].booking_id;
        bookings.push(bookingId);
      } else {
        const bookingId = (await pool.query(
          'INSERT INTO bookings (user_id, topic_id, other_is_expert) VALUES ($1, 1, false)'
          + 'RETURNING booking_id',
          [userId]
        ))
          .rows[0].booking_id;
        bookings.push(bookingId);
      }

      if (parseInt(i) === 0) {
        // repeat first user
        const bookingId = (await pool.query(
          'INSERT INTO bookings (user_id, topic_id, other_is_expert) VALUES ($1, 1, false)'
          + 'RETURNING booking_id',
          [userId]
        ))
          .rows[0].booking_id;
        bookings.push(bookingId);
      }
    }

    // insert timeslots
    for (i in bookings) {
      const bookingId = bookings[i];
      await pool.query(
        'INSERT INTO timeslots (booking_id, date_col, time_start) VALUES ($1, $2, $3)',
        [bookingId, date, time]
      );
    }
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

    for (i in auth0Ids) {
      const auth0Id = auth0Ids[i];
      await pool.query('DELETE FROM users WHERE auth0_id = $1',
        [auth0Id]);
    }
    await pool.query("SELECT SETVAL((SELECT pg_get_serial_sequence('bookings', 'booking_id')), $1, false)",
      [resetVal]);

  });

});

