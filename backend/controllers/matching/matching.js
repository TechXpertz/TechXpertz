const { preprocessBookings } = require('./preprocess');
const pool = require('../../db');
const { constructGraph, connectSameTopics, connectLeftovers } = require('./graph');
const { getBookingsWithTopic } = require('./helper');


const matchAlgo = function (date, time) {

  const bookings = preprocessBookings(date, time);
  const noMatch = await normalNormalMatching(bookings.normalNormals);
  normalExpertMatching(bookings.normalExperts);

};

const normalNormalMatching = async function (fullBookings) {

  const noSameTopics = [];
  const topics = (await pool.query(
    'SELECT topic_id FROM topics'
  ))
    .rows
    .map(topic => topic.topic_id);

  for (i in topics) {
    const topicId = topics[i];
    const bookings = await getBookingsWithTopic(topicId, fullBookings);
    if (bookings.length < 2) {
      noSameTopics.concat(bookings);
      break;
    };
    const graph = await constructGraph(bookings);
    noSameTopics.push(await connectSameTopics(graph));
  }

  const unmatchedBooking = connectLeftovers(noSameTopics);
  return unmatchedBooking;

};

const normalExpertMatching = function (bookings) {

};