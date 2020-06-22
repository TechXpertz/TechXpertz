const cron = require('node-cron');

cron.schedule('50-59/2 * * * *', () => {
  console.log('running task every minute');
});

module.exports = cron;