const pool = require('../../db');
const { addUserTopics, addUserProgLanguages } = require('./submitBackground');
const { getUserId } = require('./helper');

const editNormalBackground = async (req, res) => {

  if (!req.user) {
    return res.sendStatus(401);
  }

  const { username, education, hasExperience, interviewLevel, progLanguages, topics } = req.body;
  if (!username || !education || hasExperience === undefined
    || interviewLevel === undefined || !progLanguages || !topics) {
    return res.sendStatus(400);
  }

  const hasExperienceLowerCase = hasExperience.toLowerCase();
  if (hasExperienceLowerCase !== 'yes' && hasExperienceLowerCase !== 'no') {
    return res.sendStatus(422);
  }

  const hasExperienceBool = hasExperienceLowerCase === 'yes' ? true : false;
  const userId = await getUserId(req.user);
  normal(userId, username, education, hasExperienceBool, interviewLevel);
  updateTopics(userId, topics);
  updateProgLangs(userId, progLanguages);
  return res.sendStatus(200);
}

const editExpertBackground = async (req, res) => {

  if (!req.user) {
    return res.sendStatus(401);
  }

  const { username, company, companyRole, workingExp, topics, progLanguages } = req.body;
  if (!username || !company || !companyRole || !workingExp || !topics || !progLanguages) {
    return res.sendStatus(400);
  }

  const userId = await getUserId(req.user);

  expert(userId, username, company, companyRole, workingExp);
  updateProgLangs(userId, progLanguages);
  updateTopics(userId, topics);
  return res.sendStatus(200);

}

const expert = async (userId, username, company, companyRole, workingExp) => {
  pool.query(
    'UPDATE expert_backgrounds SET company = $1, company_role = $2, working_exp = $3, username = $4 '
    + 'WHERE user_id  = $5',
    [company, companyRole, workingExp, username, userId]
  );
}

const normal = async (userId, username, education, hasExperience, interviewLevel) => {
  pool.query(
    'UPDATE normal_backgrounds SET education = $1, has_experience = $2, '
    + 'interview_level = $3, username = $4 WHERE user_id = $5',
    [education, hasExperience, interviewLevel, username, userId]
  );
}

const updateTopics = async (userId, topics) => {
  await pool.query(
    'DELETE FROM user_topics WHERE user_id = $1',
    [userId]
  );
  addUserTopics(userId, topics);
}

const updateProgLangs = async (userId, progLanguages) => {
  await pool.query(
    'DELETE FROM user_prog_languages WHERE user_id = $1',
    [userId]
  );
  addUserProgLanguages(userId, progLanguages);
}

module.exports = {
  editNormalBackground,
  editExpertBackground
}