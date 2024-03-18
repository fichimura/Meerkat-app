const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

router.get('/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/signup', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const newUser = await new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.flash('success', 'Successfully signed up');
        res.redirect('/');
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('signup');
    }
}));

router.get('/signin', (req, res) => {
    res.render('users/signin')
});

router.post('/signin', passport.authenticate('local', { failureFlash: true, failureRedirect: '/signin' })
    , (req, res) => {
        req.flash('success', 'Signed in');
        res.redirect('/');
    });

router.get('/signout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Successfully signed out');
        res.redirect('/');
    });
});


module.exports = router;