const pool = require('../../db');

const accountType = async (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }

  const userIsExpert = await isExpert(req.user);
  const accType = userIsExpert ? 'Expert' : 'Normal';
  return res.status(200).json(accType);

}

const isExpert = async (user) => {
  const sub = user.sub;
  const is_expert = (await pool.query(
    'SELECT is_expert FROM users WHERE auth0_id = $1',
    [sub]))
    .rows[0].is_expert;
  if (is_expert === null) process.exit(1);
  return is_expert;
};

module.exports = {
  isExpert,
  accountType
}