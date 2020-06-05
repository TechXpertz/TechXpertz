const router = require('express').Router();
const pool = require('../db');

module.exports = router;

// local sign up

router.post("/", async (req, res) => {
    try {

        const { name, username, email, password } = req.body;
        const user = await pool query('SELECT * FROM local_users WHERE ')

        // 2. check if user exists



        // 3. Brcypt password

        // 4. Save user in database

        // 5. generate JWT


    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});