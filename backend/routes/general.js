const router = require('express-promise-router')();
const pool = require('../db');

router.route('/').get((req, res) => {
    res.send('Home');
});


module.exports = router;