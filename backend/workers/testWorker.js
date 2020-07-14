const { toISO, getNextTimeslot, add2Minutes, get11pmTime } = require('../controllers/cronJobs/cronHelpers');
const { deleteUnmatchedBookingsAt } = require('../controllers/cronJobs/tasks');
const { sendSuccessEmail, sendFailureEmail } = require('../controllers/cronJobs/email');
const { matchAlgo } = require('../controllers/matching/matching');

const doTaskAtTime = async (now) => {

  console.log('date', now.toDateString());
  console.log('time', now.toTimeString());
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

doTaskAtTime(new Date(Date.now()));