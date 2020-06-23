const cron = require('node-cron');
const { toISO, getNextTimeslot, add2Minutes, get1amTime } = require('./cronHelpers');
const { deleteUnmatchedBookingsAt, sendFailureEmail } = require('./tasks');
const { matchAlgo } = require('../matching/matching');

const realSchedule = '0 7,9,11,13,15,17,19,21,23 * * *';
const every2Minutes = '*/2 * * * *';

const task = timing => cron.schedule(timing, async () => {
  const now = new Date(Date.now());
  const currentTimeslot = toISO(now);
  const targetTimeslot = toISO(getNextTimeslot(now));
  console.log('current timeslot', currentTimeslot);
  console.log('target timeslot', targetTimeslot);

  if (currentTimeslot.time === '07:00') {
    const prevBooking = toISO(get1amTime(now));
    await deleteUnmatchedBookingsAt(prevBooking);
  } else {
    await deleteUnmatchedBookingsAt(currentTimeslot);
  }

  const leftovers = await matchAlgo(targetTimeslot);
  const { bookings, normalLeftover, expertLeftover } = leftovers;
  if (normalLeftover) sendFailureEmail(normalLeftover);
  if (expertLeftover) sendFailureEmail(expertLeftover);
  // sendSuccessEmail(bookings);

}, {
  scheduled: false
});



module.exports = {
  task,
  realSchedule,
  every2Minutes
};