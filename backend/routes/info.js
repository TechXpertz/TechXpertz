const router = require('express-promise-router')();
const { getProgLanguages, getTopics } = require('../controllers/info');

router.route('/prog-languages').get(getProgLanguages);
router.route('/topics').get(getTopics);

module.exports = router;
