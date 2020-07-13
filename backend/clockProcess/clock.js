const CronJob = require('cron').CronJob;
const amqp = require('amqp-connection-manager');

const AMQP_URL = process.env.CLOUDAMQP_URL || 'amqp://localhost';
if (!AMQP_URL) process.exit(1);

const WORKER_QUEUE = 'worker-queue'  // To consume from worker process
const CLOCK_QUEUE = 'clock-queue'  // To consume from clock process
const JOBS = [{
  name: 'matching process',
  message: { 'taskName': 'matching', 'queue': 'worker-queue' },
  cronTime: '0 0 5,7,9,11,13,15,17,19,21 * * *',
  repeat: 1
}, {
  name: 'test job',
  message: { 'taskName': 'test', 'queue': 'worker-queue' },
  cronTime: '0 2 * * * *',
  repeat: 1
}];

// Create a new connection manager from AMQP
const connection = amqp.connect([AMQP_URL]);
console.log('[AMQP] - Connecting...');

connection.on('connect', function () {
  process.once('SIGINT', function () {  // Close conn on exit
    connection.close()
  })
  console.log('[AMQP] - Connected!')
  return startCronProcess(JOBS)
});

connection.on('disconnect', function (params) {
  return console.error('[AMQP] - Disconnected.', params.err.stack)
});

const startCronProcess = (jobs) => {
  if (jobs && jobs.length) {
    jobs.forEach(job => {
      let j = new CronJob({
        cronTime: job.cronTime ? job.cronTime : new Date(job.dateTime),
        onTick: () => {
          sendMessage(job.message)
          if (!job.repeat) j.stop()
        },
        onComplete: () => {
          console.log('Job completed! Removing now...')
        },
        timeZone: 'Singapore',
        start: true  // Start now
      })
    })
  }
}

const sendMessage = (data) => {
  let message = data;
  if (!message) { return }

  let queue = message.queue || WORKER_QUEUE
  let senderChannelWrapper = connection.createChannel({
    json: true,
    setup: function (channel) {
      return channel.assertQueue(queue, { durable: true });
    }
  })

  senderChannelWrapper.sendToQueue(queue, message, { contentType: 'application/json', persistent: true })
    .then(function () {
      console.log('[AMQP] - Message sent to queue =>', queue)
      senderChannelWrapper.close()
    })
    .catch(err => {
      console.error('[AMQP] - Message to queue => ' + queue + '<= was rejected! ', err.stack)
      senderChannelWrapper.close()
    })
};