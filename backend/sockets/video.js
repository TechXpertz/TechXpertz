const { video, ioAuth } = require('./io');

video.use(ioAuth);

video.on('connection', socket => {

  console.log('user connected to video');

  socket.emit('join room');

  socket.on('any users', data => {
    socket.bookingId = data.bookingId;
    video.in(Object.keys(socket.rooms)[0]).clients((error, clients) => {
      if (error) console.log(error);
      if (clients.filter(client => video.connected[client].bookingId === socket.bookingId).length > 1) {
        socket.emit('duplicate users');
      } else {
        const otherSocket = clients.find(client => video.connected[client].bookingId === data.otherBookingId);
        if (otherSocket) {
          socket.emit('any users response', {
            hasUser: true,
            socketId: otherSocket
          });
        } else {
          socket.emit('any users response', {
            hasUser: false
          });
        }
      }
    });
  });

  socket.on('send offer', data => {
    socket.to(data.to).emit('receive offer', {
      offer: data.offer,
      from: socket.id
    });
  });

  socket.on('send answer', data => {
    socket.to(data.to).emit('receive answer', {
      answer: data.answer,
      from: socket.id
    });
  });

  socket.on('disconnecting', () => {
    socket.to(Object.keys(socket.rooms)[0]).emit('user disconnected');
  });

  socket.on('disconnect', () => {
    socket.leave(Object.keys(socket.rooms)[0]);
    console.log('user disconnected from video');
  })

});