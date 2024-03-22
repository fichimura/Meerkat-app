const Audiovisual = require('../models/audiovisuals');
const Review = require('../models/audiovisualReview');
const todayDate = new Date();
const todayDateFormatted = todayDate.getFullYear() + "-" + (todayDate.getMonth() + 1) + "-" + todayDate.getDate();

module.exports.showUserReviews = async (req, res) => {
    const user_reviews = await Review.find({ author: req.user._id });
    res.render('reviews/userReviews', { user_reviews });
};

module.exports.showAudiovisualReviews = async (req, res) => {
    const audiovisual = await Audiovisual.findById(req.params.audiovisual_id).
        populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author');
    if (!audiovisual) {
        req.flash('error', 'Cannot find audiovisual');
        return res.redirect('/audiovisuals');
    }
    res.render('reviews/showAllReviews', { audiovisual });
};

module.exports.renderNewForm = async (req, res) => {
    const audiovisual = await Audiovisual.findById(req.params.audiovisual_id);
    if (!audiovisual) {
        req.flash('error', 'Cannot find audiovisual');
        return res.redirect('/audiovisuals');
    }
    res.render('reviews/new', { audiovisual });
};


module.exports.showAudiovisualSpecificReview = async (req, res) => {
    const audiovisual = await Audiovisual.findById(req.params.audiovisual_id);
    const review = await Review.findById(req.params.review_id).populate('author');
    if (!audiovisual) {
        req.flash('error', 'Cannot find audiovisual');
        return res.redirect('/audiovisuals');
    }
    if (!review) {
        req.flash('error', 'Cannot find review');
        return res.redirect('/audiovisuals');
    }
    res.render('reviews/showReview', { audiovisual, review });
};


module.exports.createReview = async (req, res) => {
    const audiovisual = await Audiovisual.findById(req.params.audiovisual_id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    if (!review.title) review.title = todayDateFormatted + " - " + audiovisual.title;
    review.date_added = todayDateFormatted;
    audiovisual.reviews.push(review);
    await review.save();
    await audiovisual.save();
    req.flash('success', 'Successfully created new review');
    res.redirect(`/audiovisuals/${audiovisual._id}`);
};

module.exports.showEditReview = async (req, res) => {
    const audiovisual = await Audiovisual.findById(req.params.audiovisual_id);
    const review = await Review.findById(req.params.review_id).populate('author');
    if (!audiovisual) {
        req.flash('error', 'Cannot find audiovisual');
        return res.redirect('/audiovisuals');
    }
    if (!review) {
        req.flash('error', 'Cannot find review');
        return res.redirect('/audiovisuals');
    }
    res.render('reviews/edit', { audiovisual, review });
};

module.exports.editReview = async (req, res) => {
    const { audiovisual_id, review_id } = req.params;
    const review = await Review.findByIdAndUpdate(review_id, { ...req.body.review });
    req.flash('success', 'Successfully updated audiovisual');
    res.redirect(`/audiovisuals/${audiovisual_id}/reviews/${review._id}`);
};


module.exports.deleteReview = async (req, res) => {
    const { audiovisual_id, review_id } = req.params;
    await Audiovisual.findByIdAndUpdate(audiovisual_id, { $pull: { reviews: review_id } });
    await Review.findByIdAndDelete(req.params.review_id);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/audiovisuals/${audiovisual_id}`);
};