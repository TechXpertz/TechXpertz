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

module.exports = {
  dashboard,
  isExpert,
};
