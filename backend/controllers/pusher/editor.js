const Pusher = require('pusher');
const { pusher_config } = require('../../config');
const { appId, key, secret, cluster } = pusher_config;
const pusher = new Pusher({
  appId,
  key,
  secret,
  cluster,
  useTLS: true
});

const updateCode = (req, res) => {
  pusher.trigger('presence-editor', 'code-update', {
    ...req.body,
  });
  res.sendStatus(200);
}

const auth = (req, res) => {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const auth = pusher.authenticate(socketId, channel);
  return res.send(auth);
}

module.exports = {
  pusher,
  updateCode,
  auth
}
