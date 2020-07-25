const pool = require('../../db');
const { getUserId } = require('./helper');
const { isExpert } = require('./accountType');

const getUsername = async (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }

  const userId = await getUserId(req.user);
  const expert = await isExpert(req.user);
  const username = await getUsernameFromDb(userId, expert);
  return res.status(200).json(username);
}

const getUsernameFromDb = async (userId, expert) => {
  if (expert) {
    return (await pool.query(
      'SELECT username FROM expert_backgrounds WHERE user_id = $1',
      [userId]
    )).rows[0].username;
  } else {
    return (await pool.query(
      'SELECT username FROM normal_backgrounds WHERE user_id = $1',
      [userId]
    )).rows[0].username;
  }

}

module.exports = {
  getUsername
}