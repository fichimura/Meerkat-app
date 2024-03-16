const express = require('express');
const router = express.Router({ mergeParams: true });
const Audiovisual = require('../models/audiovisuals');
const Review = require('../models/audiovisualReview');
const { reviewSchema } = require('../JoiSchemas/JoiSchemas');
const ExpressError = require('../utils/expressError');
const catchAsync = require('../utils/catchAsync');
const todayDate = new Date();
const todayDateFormatted = todayDate.getFullYear() + "-" + (todayDate.getMonth() + 1) + "-" + todayDate.getDate();

//Middleware
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

//REVIEWS ROUTES
router.get('/reviews', catchAsync(async (req, res) => {
    const all_reviews = await Review.find({});
    res.render('reviews/index', { all_reviews });
}));

router.get('/audiovisuals/:audiovisual_id/reviews', catchAsync(async (req, res) => {
    const audiovisual = await Audiovisual.findById(req.params.audiovisual_id).populate('reviews');
    if (!audiovisual) {
        req.flash('error', 'Cannot find audiovisual');
        return res.redirect('/audiovisuals');
    }
    res.render('reviews/showAllReviews', { audiovisual });
}));

router.get('/audiovisuals/:audiovisual_id/reviews/new', catchAsync(async (req, res) => {
    const audiovisual = await Audiovisual.findById(req.params.audiovisual_id);
    if (!audiovisual) {
        req.flash('error', 'Cannot find audiovisual');
        return res.redirect('/audiovisuals');
    }
    res.render('reviews/new', { audiovisual });
}));

router.get('/audiovisuals/:audiovisual_id/reviews/:review_id', catchAsync(async (req, res) => {
    const audiovisual = await Audiovisual.findById(req.params.audiovisual_id);
    const review = await Review.findById(req.params.review_id);
    if (!audiovisual) {
        req.flash('error', 'Cannot find audiovisual');
        return res.redirect('/audiovisuals');
    }
    if (!review) {
        req.flash('error', 'Cannot find review');
        return res.redirect('/audiovisuals');
    }
    res.render('reviews/showReview', { audiovisual, review });
}));

router.post('/audiovisuals/:audiovisual_id/reviews', validateReview, catchAsync(async (req, res) => {
    const audiovisual = await Audiovisual.findById(req.params.audiovisual_id);
    const review = new Review(req.body.review);
    if (!review.title) review.title = todayDateFormatted + " - " + audiovisual.title;
    review.date_added = todayDateFormatted;
    audiovisual.reviews.push(review);
    await review.save();
    await audiovisual.save();
    req.flash('success', 'Successfully created new review');
    res.redirect(`/audiovisuals/${audiovisual._id}`);
}));

router.delete('/audiovisuals/:audiovisual_id/reviews/:review_id', catchAsync(async (req, res) => {
    const { audiovisual_id, review_id } = req.params;
    await Audiovisual.findByIdAndUpdate(audiovisual_id, { $pull: { reviews: review_id } });
    await Review.findByIdAndDelete(req.params.review_id);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/audiovisuals/${audiovisual_id}`);
}));

module.exports = router;