const pool = require('../../db');
const setAccountType = async (sub, isExpert) => {
  await pool.query(
    'UPDATE users SET is_expert = $1 WHERE auth0_id = $2',
    [isExpert, sub]
  );
};

const submitAccountType = (req, res) => {

  if (!req.user) {
    return res.sendStatus(401);
  }

  if (!req.body.accountType) {
    return res.sendStatus(400);
  }

  const sub = req.user.sub;
  const accountType = req.body.accountType.toLowerCase();

  if (accountType === 'normal') {
    setAccountType(sub, false);
    res.sendStatus(201);
  } else if (accountType === 'expert') {
    setAccountType(sub, true);
    res.sendStatus(201);
  } else {
    return res.sendStatus(422);
  }

};

module.exports = {
  submitAccountType
}