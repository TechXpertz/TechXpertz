const pool = require('../../db');

const deleteUnmatchedBookingsAt = async (datetime) => {

  let { date, time } = datetime;
  const bookingIds = (await pool.query(
    'DELETE FROM timeslots WHERE '
    + 'date_col = $1 '
    + 'AND time_start = $2 '
    + 'AND booking_id IN '
    + '(SELECT booking_id FROM bookings WHERE other_booking_id IS NULL) '
    + 'RETURNING booking_id',
    [date, time]
  ))
    .rows
    .map(booking => booking.booking_id);

  await deleteEmptyBookings(bookingIds);

};

const deleteEmptyBookings = async (bookingIds) => {

  for (bookingId of bookingIds) {
    const timeslots = (await pool.query(
      'SELECT booking_id FROM timeslots WHERE booking_id = $1',
      [bookingId]
    ));
    if (timeslots.rowCount === 0) {
      console.log('delete booking ', bookingId);
      await pool.query(
        'DELETE FROM bookings WHERE booking_id = $1',
        [bookingId]
      );
    }
  }

}

module.exports = {
  deleteUnmatchedBookingsAt,
}