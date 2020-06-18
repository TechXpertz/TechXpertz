const pool = require('../../db');

const getUserId = async (user) => {
  const sub = user.sub;
  const result = await pool.query(
    'SELECT user_id FROM users WHERE auth0_id = $1',
    [sub]
  );

  return result.rows[0].user_id;
};

const isExpert = async (user) => {
  const sub = user.sub;
  const is_expert =
    (await pool
      .query('SELECT is_expert FROM users WHERE auth0_id = $1', [sub])).rows[0].is_expert;
  assert(is_expert !== null, 'is_expert is null. Cannot call function here.');
  return is_expert;
};

module.exports = {
  getUserId
}