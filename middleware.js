const { audiovisualSchema, reviewSchema } = require('./JoiSchemas/JoiSchemas');
const ExpressError = require('./utils/expressError');
const Audiovisual = require('./models/audiovisuals');
const Review = require('./models/audiovisualReview');

module.exports.isSignedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/signin');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateAudiovisual = (req, res, next) => {
    const { error } = audiovisualSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { audiovisual_id } = req.params;
    const audiovisual = await Audiovisual.findById(audiovisual_id);
    if (!audiovisual.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/audiovisuals/${audiovisual._id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { audiovisual_id, review_id } = req.params;
    const review = await Review.findById(review_id);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/audiovisuals/${audiovisual_id}`);
    }
    next();
}