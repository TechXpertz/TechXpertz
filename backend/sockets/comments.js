const { comments, ioAuth } = require('./io');

comments.use(ioAuth);

comments.on('connection', socket => {
  console.log('user connected to comments');

  socket.emit('message', 'welcome to comments!');

  socket.on('comment', data => {
    socket.to(Object.keys(socket.rooms)[0]).emit('receive comment', data);
  });

  socket.on('disconnect', () => {
    socket.leave(Object.keys(socket.rooms)[0]);
    console.log('user disconnected')
  });

});