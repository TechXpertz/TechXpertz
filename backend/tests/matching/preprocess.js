const { preprocessBookings } = require('../../controllers/matching/preprocess');

const date = '2020-07-21';
const time = '6:00 PM';

preprocessBookings(date, time);