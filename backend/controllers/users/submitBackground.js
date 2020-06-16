const pool = require('../../db');
const { getUserId } = require('./helper');

const addUserProgLanguages = (userId, progLanguages) => {

  progLanguages.forEach(async progLang => {

    const progName = progLang.progName;
    const progIdRes = await pool.query(
      'SELECT prog_id FROM prog_languages WHERE prog_name = $1',
      [progName]
    );

    const progId = progIdRes.rows[0].prog_id;

    await pool.query(
      'INSERT INTO user_prog_languages (user_id, prog_id) VALUES ($1, $2)',
      [userId, progId]
    );

  });

};

const addUserTopics = async (userId, topics) => {

  topics.forEach(async topic => {

    const topicName = topic.topicName;
    const topicIdRes = await pool.query(
      'SELECT topic_id FROM topics WHERE topic_name = $1',
      [topicName]
    );

    const topicId = topicIdRes.rows[0].topic_id;

    await pool.query(
      'INSERT INTO user_topics (user_id, topic_id) VALUES ($1, $2)',
      [userId, topicId]
    );
  });
};

const addNormalBackground = async (userId, education, hasExperience, interviewLevel) => {
  await pool.query(
    'INSERT INTO normal_backgrounds (user_id, education, has_experience, interview_level) '
    + 'VALUES ($1, $2, $3, $4)',
    [userId, education, hasExperience, interviewLevel]
  );
};

const addExpertBackground = async (userId, company, companyRole, workingExp) => {
  await pool.query(
    'INSERT INTO expert_backgrounds (user_id, company, company_role, working_exp) '
    + 'VALUES ($1, $2, $3, $4)',
    [userId, company, companyRole, workingExp]);
};

const submitNormalBackground = async (req, res) => {

  if (!req.user) {
    return res.sendStatus(401);
  }

  const { education, hasExperience, interviewLevel, progLanguages, topics } = req.body;
  if (!education || !hasExperience || !interviewLevel || !progLanguages || !topics) {
    return res.sendStatus(400);
  }

  const userId = await getUserId(req.user);

  addNormalBackground(userId, education, hasExperience, interviewLevel);
  addUserProgLanguages(userId, progLanguages)
  addUserTopics(userId, topics)
  return res.sendStatus(201);

};

const submitExpertBackground = async (req, res) => {

  if (!req.user) {
    return res.sendStatus(401);
  }

  const { company, companyRole, workingExp, topics, progLanguages } = req.body;
  if (!company || !companyRole || !workingExp || !topics || !progLanguages) {
    return res.sendStatus(400);
  }

  const userId = await getUserId(req.user);

  addExpertBackground(userId, company, companyRole, workingExp);
  addUserProgLanguages(userId, progLanguages);
  addUserTopics(userId, topics);
  return res.sendStatus(201);

};

module.exports = {
  submitNormalBackground,
  submitExpertBackground
}