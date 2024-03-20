const User = require('../models/user');

module.exports.showUserSignUp = (req, res) => {
    res.render('users/signup');
}

module.exports.userSignUp = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const newUser = await new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Successfully signed up');
            res.redirect('/');
        });
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('signup');
    }
}

module.exports.showSignIn = (req, res) => {
    res.render('users/signin')
}

module.exports.userSignIn = (req, res) => {
    const redirectUrl = res.locals.returnTo ? res.locals.returnTo : '/';
    req.flash('success', 'Signed in');
    res.redirect(redirectUrl);
}

module.exports.userSignOut = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Successfully signed out');
        res.redirect('/');
    });
}