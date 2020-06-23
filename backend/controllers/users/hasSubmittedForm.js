const pool = require('../../db');
const { getUserId } = require('./helper');

const checkUserBackgroundSubmission = async (req, res) => {

  if (!req.user) {
    return res.sendStatus(401);
  }

  const userId = await getUserId(req.user);
  const isExpert = await checkIsExpert(userId);
  const hasSubmittedForm = await checkHasSubmittedForm(userId, isExpert);
  let accountType;
  if (isExpert === true) {
    accountType = 'Expert';
  } else if (isExpert === false) {
    accountType = 'Normal';
  } else {
    accountType = 'AccountType';
  }
  return res.status(200).json({
    accountType,
    hasSubmittedForm
  });

};

const checkIsExpert = async (userId) => {

  const isExpert = (await pool.query(
    'SELECT is_expert FROM users WHERE user_id = $1',
    [userId]
  ))
    .rows[0]
    .is_expert;

  return isExpert;

}

const checkHasSubmittedForm = async (userId, isExpert) => {
  if (isExpert === null) {
    return false;
  }

  if (isExpert) {

    const hasSubmitted = (await pool.query(
      'SELECT user_id FROM expert_backgrounds WHERE user_id = $1',
      [userId]
    ));
    if (hasSubmitted.rowCount === 0) {
      return false;
    } else {
      return true;
    }

  } else {

    const hasSubmitted = (await pool.query(
      'SELECT user_id FROM normal_backgrounds WHERE user_id = $1',
      [userId]
    ));
    if (hasSubmitted.rowCount === 0) {
      return false;
    } else {
      return true;
    }

  }
}

module.exports = {
  checkUserBackgroundSubmission
}