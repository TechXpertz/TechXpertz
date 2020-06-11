const pool = require('../db');

const getProgLanguages = async (req, res) => {
  const prog_langs = await pool
    .query('SELECT JSON_AGG(JSON_BUILD_OBJECT(prog_id, prog_name)) FROM prog_languages');

  res.json(prog_langs.rows[0]);
};

const getTopics = async (req, res) => {
  const topics = await pool
    .query('SELECT JSON_AGG(JSON_BUILD_OBJECT(topic_id, topic)) FROM topics');

  res.json(topics.rows[0]);
};

module.exports = {
  getProgLanguages,
  getTopics,
};
