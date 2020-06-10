const pool = require('../db');

const dashboard = (req, res) => {
    res.send(`private info!`);
}

const isExpert = async (user) => {
    const sub = user.sub;
    try {
        const is_expert =
            await pool.query("SELECT is_expert FROM users WHERE auth0_id = $1", [sub]);
        return is_expert;
    } catch (err) {
        return res.sendStatus(500);
    }
}

module.exports = {
    dashboard,
    isExpert
}