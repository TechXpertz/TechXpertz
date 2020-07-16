const { doTaskAtTime } = require("../controllers/cronJobs/schedule");

const task = () => {
  const now = new Date(Date.now());
  const hour = now.getHours();
  const validHours = [5, 7, 9, 11, 13, 15, 17, 19, 21];
  if (!validHours.includes(hour)) {
    return;
  }
  doTaskAtTime(now);
}

task();