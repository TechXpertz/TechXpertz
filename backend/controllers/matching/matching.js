const { getBookings } = require('./preprocess');


const match = function (date, time) {

  const bookings = getBookings(date, time);
  const normalNormalBookings = bookings.normalNormals;
  const normalExpertBookings = bookings.normalExperts;

  normalNormalMatching(normalNormalBookings);
  normalExpertMatching(nromalExpertBookings);

};


const normalNormalMatching = function (users) {




  // 2. sort by topics



  // 3. match


};

const normalExpertMatching = function (users) {

};