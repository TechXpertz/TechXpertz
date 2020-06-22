const pool = require('../db');

const getProgLanguages = async (req, res) => {
  const progLanguages = (await pool.query(
    'SELECT prog_name AS "progName" FROM prog_languages'
  ))
    .rows;
  res.json({ progLanguages });
};

const getTopics = async (req, res) => {
  const topics = (await pool.query(
    'SELECT topic_name AS "topicName" FROM topics'
  ))
    .rows;
  res.json({ topics });
};

module.exports = {
  getProgLanguages,
  getTopics,
};
