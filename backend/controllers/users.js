const pool = require('../db');
const assert = require('assert');

const dashboard = (req, res) => {
  res.send('private info!');
};

const isExpert = async (user) => {
  const sub = user.sub;
  try {
    const is_expert =
      await pool
        .query('SELECT is_expert FROM users WHERE auth0_id = $1', [sub]);
    assert(is_expert !== null, 'is_expert is null. Cannot call function here.');
    return is_expert;
  } catch (err) {
    console.error(err);
  }
};

const submitAccountType = async (req, res) => {

  if (!req.user) {
    return res.sendStatus(401);
  }

  const sub = req.user.sub;
  const accountType = req.body.accountType;
  console.log(req.body);

  if (accountType === 'normal') {
    await pool.query(
      'UPDATE users SET is_expert = $1 WHERE auth0_id = $2',
      [false, sub]
    );
    res.sendStatus(200);
  } else if (accountType === 'expert') {
    await pool.query(
      'UPDATE users SET is_expert = $1 WHERE auth0_id = $2',
      [true, sub]
    );
    res.sendStatus(200);
  } else {
    return res.sendStatus(400);
  }

}

module.exports = {
  dashboard,
  submitAccountType
};
