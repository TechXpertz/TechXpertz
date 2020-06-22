const pool = require('../../db');

const constructGraph = async (bookings) => {

  console.log('bookings: ', bookings);
  const edgeList = []; // list of sets
  const degrees = new Map(); // key: bookingId, value: degree

  const orderedBookings = (await pool.query(
    'SELECT * FROM booking_prog_languages WHERE booking_id = ANY ($1) '
    + 'ORDER BY prog_id',
    [bookings]
  ))
    .rows;

  console.log('orderedBookings: ', orderedBookings);

  let start = 0;
  let end = 0;
  let progId = 0;

  while (start < orderedBookings.length) {

    progId = orderedBookings[start].prog_id;
    end = start + 1;
    while (end < orderedBookings.length && orderedBookings[end].prog_id === progId) {
      makeEdgeIfPossible(
        orderedBookings[start].booking_id,
        orderedBookings[end].booking_id,
        edgeList,
        degrees
      );
      end++;
    }
    start++;
  }

  return { edgeList, degrees };

}

const makeEdgeIfPossible = (nodeA, nodeB, edgeList, degrees) => {

  if (edgeList.some(edge => edge.has(nodeA) && edge.has(nodeB))) {
    return;
  } else {
    const edge = new Set([nodeA, nodeB]);
    edgeList.push(edge);
    if (degrees.has(nodeA)) {
      degrees.set(nodeA, degrees.get(nodeA) + 1);
    } else {
      degrees.set(nodeA, 1);
    }
    if (degrees.has(nodeB)) {
      degrees.set(nodeB, degrees.get(nodeB) + 1);
    } else {
      degrees.set(nodeB, 1);
    }
  }

};

const connectSameTopics = async (graph) => {

  const { edgeList, degrees } = graph;
  const degreeList = Array.from(degrees);
  degreeList.sort((a, b) => a.value - b.value); // ascending degrees 
  const unmatched = [];

  // match those with overlapping prog languages
  for (index in degreeList) {
    const { key: bookingId, value: degree } = degreeList[index];

  }

};

const findAnyEdge = (bookingId, edgeList) => {
  const edge = edgeList.find(element => element.has(bookingId));
  return edge;
}

module.exports = {
  constructGraph,
  connectSameTopics
}
