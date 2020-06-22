function Node(bookingId) {
  this.bookingId = bookingId;
  this.degree = 0;
  this.neighbours = [];
}

Node.prototype = {
  hasNeighbour: function (booking) {
    return this.neighbours.includes(booking)
  },
  addNeighbour: function (booking) {
    this.neighbours.push(booking);
    this.degree++
  }
}

module.exports = { Node };