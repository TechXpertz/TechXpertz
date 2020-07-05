const { video, ioAuth } = require('./io');

video.on('connection', socket => {
  console.log('user connected to video');

  socket.emit('message', 'welcome to video!');

  socket.on('call-user', data => {
    socket.emit('call-made', {
      offer: data.offer,
      socket: socket.id
    });
  });

  socket.on('make-answer', data => {
    socket.to(data.to).emit('answer-made', {
      socket: socket.id,
      answer: data.answer
    });
  });

  socket.on('disconnect', () => {
    // socket.leave(Object.keys(socket.rooms)[0]);
    console.log('user disconnected')
  });

});