const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');

router.get('/signup', userController.showUserSignUp);

router.post('/signup', catchAsync(userController.userSignUp));

router.get('/signin', userController.showSignIn);

router.post('/signin', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/signin' })
    , userController.userSignIn);

router.get('/signout', userController.userSignOut);


module.exports = router;