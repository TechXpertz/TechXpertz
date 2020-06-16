const router = require('express-promise-router')();
const { getProgLanguages, getTopics } = require('../controllers/query');

router.route('/prog-languages').get(getProgLanguages);
router.route('/topics').get(getTopics);

module.exports = router;
