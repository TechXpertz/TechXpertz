const pool = require('../db');
const assert = require('assert');

const dashboard = (req, res) => {
  res.send('private info!');
};

const isExpert = async (user) => {
  const sub = user.sub;
  const is_expert =
    (await pool
      .query('SELECT is_expert FROM users WHERE auth0_id = $1', [sub])).rows[0].is_expert;
  assert(is_expert !== null, 'is_expert is null. Cannot call function here.');
  return is_expert;
};

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

  if (accountType === 'normal') {
    setAccountType(sub, false);
    res.sendStatus(200);
  } else if (accountType === 'expert') {
    setAccountType(sub, true);
    res.sendStatus(200);
  } else {
    return res.sendStatus(400);
  }

};

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
      'SELECT topic_id FROM topics WHERE topic = $1',
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
    'INSERT INTO normal_backgrounds (user_id, education, has_experience, interview_level) VALUES ($1, $2, $3, $4)',
    [userId, education, hasExperience, interviewLevel]
  );
};

const submitNormalBackground = async (req, res) => {

  if (!req.user) {
    return res.sendStatus(401);
  }

  const { education, hasExperience, interviewLevel, progLanguages, topics } = req.body;
  if (!education || !hasExperience || !interviewLevel || !progLanguages || !topics) {
    return res.sendStatus(400);
  }

  const sub = req.user.sub;
  const result = await pool.query(
    'SELECT user_id FROM users WHERE auth0_id = $1',
    [sub]
  );

  const userId = result.rows[0].user_id;

  addNormalBackground(userId, education, hasExperience, interviewLevel);
  addUserProgLanguages(userId, progLanguages)
  addUserTopics(userId, topics)
  return res.sendStatus(200);

};

module.exports = {
  dashboard,
  submitAccountType,
  submitNormalBackground
};
