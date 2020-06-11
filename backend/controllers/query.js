const pool = require('../db');

const getProgLanguages = async (req, res) => {
    const response = await pool.query("SELECT JSON_AGG(JSON_BUILD_OBJECT(prog_id, prog_name)) FROM prog_languages");

    res.send(response.rows[0]);
}

const getTopics = async (req, res) => {
    const response = await pool.query("SELECT JSON_AGG(JSON_BUILD_OBJECT(topic_id, topic)) FROM topics");

    res.send(response.rows[0]);
}

module.exports = {
    getProgLanguages,
    getTopics
}