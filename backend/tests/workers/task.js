const { doTaskAtTime } = require('../../controllers/cronJobs/schedule');

const now = new Date(2020, 6, 21, 17);

doTaskAtTime(now);