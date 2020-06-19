const pool = require('../../db');
const { BinaryHeap } = require('./binaryHeap');
const { Node } = require('./node');
const { match } = require('./settingMatch');

const constructGraph = async (bookings) => {

  console.log('bookings: ', bookings);
  const nodes = new Map(); // key: bookingId, value: node

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

  for (const booking of orderedBookings) {
    nodes.set(booking.booking_id, new Node(booking.booking_id));
  }

  while (start < orderedBookings.length) {

    progId = orderedBookings[start].prog_id;
    end = start + 1;
    while (end < orderedBookings.length && orderedBookings[end].prog_id === progId) {
      makeEdgeIfPossible(
        orderedBookings[start].booking_id,
        orderedBookings[end].booking_id,
        nodes
      );
      end++;
    }
    start++;
  }

  console.log(nodes);
  return nodes;

}

const areNeighbours = (bookingA, bookingB, nodes) => {
  return nodes.get(bookingA).hasNeighbour(bookingB)
    && nodes.get(bookingB).hasNeighbour(bookingA);
}

const makeEdgeIfPossible = (bookingA, bookingB, nodes) => {

  if (areNeighbours(bookingA, bookingB, nodes)) {
    return;
  } else {
    console.log(`draw an edge between ${bookingA} and ${bookingB}`);
    nodes.get(bookingA).addNeighbour(bookingB);
    nodes.get(bookingB).addNeighbour(bookingA);
  }

};

const connectWithinGraph = async (graph) => {

  nodes = Array.from(graph);
  console.log('nodes', nodes);
  const unmatched = [];
  const visited = [];

  const heap = new BinaryHeap(
    element => element.degree,
    element => element.bookingId,
    'degree'
  );

  nodes.forEach(element => {
    heap.push(element[1])
  });
  console.log('heap', heap);

  // match those with overlapping prog languages
  while (heap.size() > 0 && visited.length !== graph.size) {
    const node = heap.pop();
    console.log('visited so far', visited);
    console.log('processing ', node);
    if (visited.includes(node.bookingId)) {
      console.log('already visited');
      continue;
    } else if (node.neighbours.length === 0) {
      console.log('no neighbours');
      unmatched.push(node.bookingId);
      visited.push(node.bookingId);
    } else {
      visited.push(node.bookingId);
      const partnerBooking = node.neighbours.find(element => !visited.includes(element));

      if (!partnerBooking) {
        unmatched.push(node.bookingId);
        console.log('no neighbours');
        continue;
      }

      visited.push(partnerBooking);
      await match(node.bookingId, partnerBooking);
      const uniqueNeighbours = new Set();

      for (const neighbour of node.neighbours) {
        const neighbourNode = graph.get(neighbour);
        if (neighbourNode.bookingId !== node.bookingId && neighbourNode.bookingId !== partnerBooking) {
          uniqueNeighbours.add(neighbour);
        }
      }

      for (const neighbour of graph.get(partnerBooking).neighbours) {
        const neighbourNode = graph.get(neighbour);
        if (neighbourNode.bookingId !== node.bookingId && neighbourNode.bookingId !== partnerBooking) {
          uniqueNeighbours.add(neighbour);
        }
      }

      console.log('unique neighbours ', uniqueNeighbours);
      uniqueNeighbours.forEach(booking => {
        heap.decreaseKey(booking, graph.get(booking).degree - 1);
      });

      console.log('heap now', heap);


    }
  }

  console.log('unmatched', unmatched);
  const leftover = randomlyMatch(unmatched);
  console.log('leftover', leftover);
  return leftover;

};

const randomlyMatch = (unmatched) => {

  unmatched.sort();

  if (unmatched.length === 0) {
    return undefined;
  } else if (unmatched.length === 1) {
    return unmatched[0];
  }

  for (let i = 0; i < unmatched.length; i = i + 2) {
    match(unmatched[i], unmatched[i + 1]);
  }

  return unmatched.length % 2 === 0 ? undefined : unmatched[length - 1];

};

module.exports = {
  constructGraph,
  connectWithinGraph
}
