module.exports = {

    dashboard: (req, res) => {
        res.send(`UsersController.dashboard() called! Hello ${req.user.displayName}`);
    },

}