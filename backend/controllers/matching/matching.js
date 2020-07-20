const { preprocessBookings } = require('./preprocess');
const pool = require('../../db');
const { constructGraph, connectWithinGraph } = require('./graph');
const { getBookingsWithTopic } = require('./helper');
const { expertProcess } = require('./expertMatching');

const matchAlgo = async function (now) {

  const { date, time } = now;

  const bookings = await preprocessBookings(date, time);
  const normalLeftover = await normalNormalMatching(bookings.normalNormals);
  const expertLeftover = await normalExpertMatching(bookings.normalExperts, bookings.expertBookings);
  return { bookings, normalLeftover, expertLeftover };

};

const normalNormalMatching = async function (fullBookings) {

  console.log('fullBookings', fullBookings)

  let noSameTopics = [];
  const topics = (await pool.query(
    'SELECT topic_id FROM topics'
  ))
    .rows
    .map(topic => topic.topic_id);

  for (const topicId of topics) {
    const bookings = await getBookingsWithTopic(topicId, fullBookings);
    // console.log('bookings with same topic ', bookings)
    if (bookings.length < 2) {
      noSameTopics = noSameTopics.concat(bookings);
      // console.log('no same topics', noSameTopics)
      continue;
    };
    const graph = await constructGraph(bookings);
    noSameTopics.push(await connectWithinGraph(graph));
  }

  const unmatchedBooking = await (connectWithinGraph(await constructGraph(noSameTopics)));
  console.log('unmatched booking', unmatchedBooking);

  return unmatchedBooking;

};

const normalExpertMatching = async function (normals, experts) {

  let noSameTopics = {
    normals: [],
    experts: []
  };
  const topics = (await pool.query(
    'SELECT topic_id FROM topics'
  ))
    .rows
    .map(topic => topic.topic_id);

  for (topicId of topics) {
    const left = await getBookingsWithTopic(topicId, normals);
    const right = await getBookingsWithTopic(topicId, experts);
    const leftover = await expertProcess(left, right);
    console.log('leftover', leftover);
    noSameTopics.normals = noSameTopics.normals.concat(leftover.normals);
    noSameTopics.experts = noSameTopics.experts.concat(leftover.experts);
  }

  console.log(noSameTopics);

  const unmatched = await expertProcess(noSameTopics.normals, noSameTopics.experts);
  return unmatched;
};

module.exports = {
  matchAlgo,
  normalNormalMatching
}