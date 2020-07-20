const pool = require('../../db');
const { HopcroftKarp } = require('./hopcroftKarp');
const { match } = require('./settingMatch');

const expertProcess = async (left, right) => {
  const edges = await expertGraph(left, right);
  const hopcroftKarp = new HopcroftKarp({
    left,
    right,
    edges
  });
  const { pairU, pairV } = hopcroftKarp.run();
  expertMatch(left, pairU, hopcroftKarp.NIL);
  const normalUnmatched = left.filter(u => pairU.get(u) === hopcroftKarp.NIL);
  const expertUnmatched = right.filter(v => pairV.get(v) === hopcroftKarp.NIL);
  const leftover = await expertRandomlyMatch(normalUnmatched, expertUnmatched);
  return leftover;
}

const expertGraph = async (left, right) => {

  const edges = new Map();
  const allBookings = left.concat(right);
  const orderedBookings = (await pool.query(
    'SELECT * FROM booking_prog_languages WHERE booking_id = ANY($1) ORDER BY prog_id',
    [allBookings]
  )).rows;

  for (const booking of allBookings) {
    edges.set(booking, []);
  }

  let start = 0;
  let end = 0;
  let progId = 0;

  while (start < orderedBookings.length) {

    progId = orderedBookings[start].prog_id;
    end = start + 1;
    while (end < orderedBookings.length && orderedBookings[end].prog_id === progId) {
      makeEdge(
        orderedBookings[start].booking_id,
        orderedBookings[end].booking_id,
        edges,
        left,
        right
      );
      end++;
    }
    start++;
  }

  console.log('edges', edges);
  return edges;

}

const areNeighbours = (u, v, edges) => {
  return edges.get(u).includes(v) && edges.get(v).includes(u);
}

const fromSeparateGroup = (u, v, left, right) => {
  return (left.includes(u) && right.includes(v) && !left.includes(v) && !right.includes(u))
    || (right.includes(u) && left.includes(v) && !right.includes(v) && !left.includes(u));
}

const makeEdge = (u, v, edges, left, right) => {
  if (!areNeighbours(u, v, edges) && fromSeparateGroup(u, v, left, right)) {
    edges.get(u).push(v);
    edges.get(v).push(u);
  }
}

const expertMatch = async (left, pairU, NIL) => {
  for (u of left) {
    if (pairU.has(u) && pairU.get(u) !== NIL) {
      match(u, pairU.get(u));
    }
  }
}

const expertRandomlyMatch = async (normals, experts) => {
  normals.sort();
  experts.sort();
  let normalIndex = 0;
  let expertIndex = 0;
  const matched = [];
  while (normalIndex < normals.length && expertIndex < experts.length) {
    match(normals[normalIndex], experts[expertIndex]);
    matched.push(normals[normalIndex]);
    matched.push(experts[expertIndex]);
    normalIndex++;
    expertIndex++;
  }

  return {
    normals: normals.filter(u => !matched.includes(u)),
    experts: experts.filter(v => !matched.includes(v))
  }
}

module.exports = {
  expertProcess
}