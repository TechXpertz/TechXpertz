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

  const sub = req.user.sub;
  const accountType = req.body.accountType;

  if (accountType === 'Normal') {
    setAccountType(sub, false);
    res.sendStatus(201);
  } else if (accountType === 'Expert') {
    setAccountType(sub, true);
    res.sendStatus(201);
  } else {
    return res.sendStatus(400);
  }

};

module.exports = {
  submitAccountType
}