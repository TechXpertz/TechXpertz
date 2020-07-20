const { question, ioAuth } = require('./io');

question.use(ioAuth);

question.on('connection', socket => {
  console.log('user connected to question');

  socket.emit('message', 'welcome to question!');

  socket.on('question', data => {
    socket.to(Object.keys(socket.rooms)[0]).emit('receive question', data);
  });

  socket.on('get question', () => {
    socket.to(Object.keys(socket.rooms)[0]).emit('receive get question');
  })

  socket.on('switch', () => {
    socket.to(Object.keys(socket.rooms)[0]).emit('receive switch');
  });

  socket.on('disconnect', () => {
    socket.leave(Object.keys(socket.rooms)[0]);
    console.log('user disconnected from question')
  });

});