const sendFailureEmail = (bookingId) => {
  console.log('send failure email to', bookingId);
}

const sendSuccessEmail = (bookingId) => {
  console.log('send success email to', bookingId);
}

module.exports = {
  sendFailureEmail,
  sendSuccessEmail
}