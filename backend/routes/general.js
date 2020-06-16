const router = require('express-promise-router')();

router.route('/').get((req, res) => {
  res.send('Home');
});


module.exports = router;
