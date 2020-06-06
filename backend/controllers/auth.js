module.exports = {
    // signUp: async (req, res, next) => {
    //     res.send('UsersController.signUp() called!');
    // },

    // logIn: async (req, res, next) => {
    //     res.send('UsersController.logIn() called!');
    // },

    failed: (req, res) => {
        res.send('You have failed to login!');
    },

    logOut: async (req, res) => {
        req.logout();
        req.session = null;
        res.redirect('/');
    },

    isLoggedIn: async (req, res, next) => {
        if (!req.user) {
            res.sendStatus(401);
        } else {
            next();
        }
    }
}