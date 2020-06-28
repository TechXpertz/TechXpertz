const { editor, ioAuth } = require('./io');


editor.use(ioAuth);

editor.on('connection', socket => {
  console.log('user connected');

  socket.emit('message', 'welcome!');

  socket.on('code', data => {
    socket.to(Object.keys(socket.rooms)[0]).emit('receive code', data);
  });

  socket.on('disconnect', () => {
    socket.leave(Object.keys(socket.rooms)[0]);
    console.log('user disconnected')
  });

});