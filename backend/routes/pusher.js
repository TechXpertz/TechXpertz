const router = require('express-promise-router')();
const { updateCode, auth } = require('../controllers/pusher/editor');

router.route('/update-editor').post(updateCode);
router.route('/auth').post(auth);


module.exports = router;