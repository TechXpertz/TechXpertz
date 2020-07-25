const { question, ioAuth } = require('./io');
const { getOrInsertRole, switchRoles, hasSwitched, hasUserSwitched } = require('../controllers/interviewRoom/roles');

question.use(ioAuth);

question.on('connection', socket => {
  console.log('user connected to question');

  socket.emit('message', 'welcome to question!');

  socket.emit('connect');

  socket.to(Object.keys(socket.rooms)[0]).emit('other user connected');

  socket.on('receive present', async bookingId => {
    const hasSwitched = await hasUserSwitched(bookingId);
    socket.emit('hasSwitched', hasSwitched);
  });

  socket.on('receive other connection', async bookingId => {
    const hasSwitched = await hasUserSwitched(bookingId);
    socket.emit('hasSwitched', hasSwitched);
    socket.to(Object.keys(socket.rooms)[0]).emit('present');
  });

  socket.on('role', async data => {
    const role = await getOrInsertRole(data.bookingId, data.role);
    socket.emit('receive role', role);
  });

  socket.on('question', data => {
    socket.to(Object.keys(socket.rooms)[0]).emit('receive question', data);
  });

  socket.on('get question', () => {
    socket.to(Object.keys(socket.rooms)[0]).emit('receive get question');
  })

  socket.on('switch', bookingId => {
    switchRoles(bookingId);
    socket.to(Object.keys(socket.rooms)[0]).emit('receive switch');
  });

  socket.on('disconnecting', () => {
    socket.to(Object.keys(socket.rooms)[0]).emit('user disconnected');
  });

  socket.on('disconnect', () => {
    socket.leave(Object.keys(socket.rooms)[0]);
    console.log('user disconnected from question')
  });

});