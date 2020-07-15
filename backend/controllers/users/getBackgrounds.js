const { getUserId } = require("./helper");
const pool = require("../../db");

const getUserBackground = async (req, res) => {

  if (!req.user) {
    return res.sendStatus(401);
  }

  const userId = await getUserId(req.user);
  const isExpert = await isUserExpert(userId);
  if (isExpert.error) {
    return res.status(400).json(isExpert.error);
  }

  const background = await getBackground(userId, isExpert);

  if (background.error) {
    return res.status(400).json(background.error);
  }

  const topics = await getUserTopics(userId);
  const progLanguages = await getUserProgLanguages(userId);


  return res.status(200).json({
    topics,
    progLanguages,
    background
  });

}

const isUserExpert = async (userId) => {
  const isExpert = (await pool.query(
    'SELECT is_expert FROM users WHERE user_id = $1',
    [userId]
  )).rows[0].is_expert;
  if (isExpert === null) {
    return { error: 'User has not submitted background' };
  } else {
    return isExpert;
  }
}

const getBackground = async (userId, isExpert) => {

  if (isExpert) {
    const expertRes = await pool.query(
      'SELECT * FROM expert_backgrounds WHERE user_id = $1',
      [userId]
    );

    if (expertRes.rowCount === 0) {
      return { error: 'User has not submitted background' };
    } else {
      const { is_verified, company, company_role, working_exp } = expertRes.rows[0];
      return {
        isVerified: is_verified,
        company,
        companyRole: company_role,
        workingExp: working_exp
      };
    }

  } else {
    const normalRes = await pool.query(
      'SELECT * FROM normal_backgrounds WHERE user_id = $1',
      [userId]
    );

    if (normalRes.rowCount === 0) {
      return { error: 'User has not submitted background' };
    } else {
      const { education, has_experience, interview_level } = normalRes.rows[0];
      return {
        education,
        hasExperience: has_experience,
        interviewLevel: interview_level
      };
    }
  }
}

const getUserTopics = async (userId) => {
  const topicIds = (await pool.query(
    'SELECT ARRAY_AGG(topic_id) FROM user_topics WHERE user_id = $1',
    [userId]
  ))
    .rows[0]
    .array_agg;

  const topics = (await pool.query(
    'SELECT ARRAY_AGG(topic_name) FROM topics WHERE topic_id = ANY($1)',
    [topicIds]
  ))
    .rows[0]
    .array_agg;

  return topics;

}

const getUserProgLanguages = async (userId) => {
  const progIds = (await pool.query(
    'SELECT ARRAY_AGG(prog_id) FROM user_prog_languages WHERE user_id = $1',
    [userId]
  ))
    .rows[0]
    .array_agg;

  const progs = (await pool.query(
    'SELECT ARRAY_AGG(prog_name) FROM prog_languages WHERE prog_id = ANY($1)',
    [progIds]
  ))
    .rows[0]
    .array_agg;

  return progs;
}

module.exports = { getUserBackground }