const { comments, ioAuth } = require('./io');
// const { insertComment } = require('../controllers/comments/createComment');

comments.use(ioAuth);

comments.on('connection', socket => {
  console.log('user connected to comments');

  socket.emit('message', 'welcome to comments!');

  socket.on('comment', data => {
    // insertComment(data.bookingId, data.comment, data.date, data.timeStamp);
    socket.to(Object.keys(socket.rooms)[0]).emit('receive comment', data.comment);
  });

  socket.on('disconnect', () => {
    socket.leave(Object.keys(socket.rooms)[0]);
    console.log('user disconnected')
  });

});