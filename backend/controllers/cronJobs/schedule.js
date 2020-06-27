const cron = require('node-cron');
const { toISO, getNextTimeslot, add2Minutes, get11pmTime } = require('./cronHelpers');
const { deleteUnmatchedBookingsAt } = require('./tasks');
const { sendSuccessEmail, sendFailureEmail } = require('./email');
const { matchAlgo } = require('../matching/matching');

const realSchedule = '0 5,7,9,11,13,15,17,19,21 * * *';
const every2Minutes = '*/2 * * * *';

const task = timing => cron.schedule(timing, async () => {
  const now = new Date(Date.now());
  await doTaskAtTime(now);

}, {
  scheduled: false
});

const doTaskAtTime = async (now) => {

  const currentTimeslot = toISO(now);
  const targetTimeslot = toISO(add2Minutes(now));
  console.log('current timeslot', currentTimeslot);
  console.log('target timeslot', targetTimeslot);

  if (currentTimeslot.time === '05:00') {
    const prevBooking = toISO(get11pmTime(now));
    console.log('11pm yesterday', prevBooking);
    await deleteUnmatchedBookingsAt(prevBooking);
  } else {
    await deleteUnmatchedBookingsAt(currentTimeslot);
  }

  const leftovers = await matchAlgo(targetTimeslot);
  const { bookings, normalLeftover, expertLeftover } = leftovers;
  if (normalLeftover) sendFailureEmail(normalLeftover);
  if (expertLeftover) sendFailureEmail(expertLeftover);
  // sendSuccessEmail(bookings);

};



module.exports = {
  task,
  realSchedule,
  every2Minutes,
  doTaskAtTime
};