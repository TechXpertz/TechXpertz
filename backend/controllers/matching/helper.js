const pool = require('../../db');

const getBookingsWithTopic = async (topicId, bookings) => {
  return (await pool.query(
    'SELECT booking_id FROM bookings WHERE topic_id = $1 AND booking_id IN ($2)',
    [topicId, bookings]
  ))
    .rows
    .map(booking => booking.booking_id);
}

module.exports = {
  getBookingsWithTopic
}


