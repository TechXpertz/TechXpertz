const pool = require('../../db');

const getUserId = async (user) => {
  const sub = user.sub;
  const result = await pool.query(
    'SELECT user_id FROM users WHERE auth0_id = $1',
    [sub]
  );

  return result.rows[0].user_id;
};

module.exports = {
  getUserId
}