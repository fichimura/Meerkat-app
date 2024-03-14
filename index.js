const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Audiovisual = require('./models/audiovisuals');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/expressError');
const { audiovisualSchema, reviewSchema } = require('./JoiSchemas/JoiSchemas');
const Review = require('./models/audiovisualReview');
const todayDate = new Date();
const todayDateFormatted = todayDate.getFullYear() + "-" + (todayDate.getMonth() + 1) + "-" + todayDate.getDate();

mongoose.connect('mongodb://127.0.0.1:27017/meerkat-app');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Database connected successfully");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateAudiovisual = (req, res, next) => {
    const { error } = audiovisualSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home');
});

// AUDIOVISUALS ROUTES
app.get('/audiovisuals', catchAsync(async (req, res) => {
    const all_audiovisuals = await Audiovisual.find({});
    res.render('audiovisuals/index', { all_audiovisuals });
}));

app.get('/audiovisuals/new', (req, res) => {
    res.render('audiovisuals/new')
});

app.post('/audiovisuals', validateAudiovisual, catchAsync(async (req, res) => {
    req.body.audiovisual.date_added = todayDateFormatted;
    const audiovisual = new Audiovisual(req.body.audiovisual);
    await audiovisual.save();
    res.redirect(`/audiovisuals/${audiovisual._id}`);
}));

app.get('/audiovisuals/:audiovisual_id', catchAsync(async (req, res, next) => {
    const audiovisual = await Audiovisual.findById(req.params.audiovisual_id);
    res.render('audiovisuals/show', { audiovisual });
}));

app.get('/audiovisuals/:audiovisual_id/edit', catchAsync(async (req, res) => {
    const audiovisual = await Audiovisual.findById(req.params.audiovisual_id);
    res.render('audiovisuals/edit', { audiovisual });
}));

app.put('/audiovisuals/:audiovisual_id', validateAudiovisual, catchAsync(async (req, res) => {
    const { audiovisual_id } = req.params;
    const audiovisual = await Audiovisual.findByIdAndUpdate(audiovisual_id, { ...req.body.audiovisual });
    res.redirect(`/audiovisuals/${audiovisual._id}`);
}));

app.delete('/audiovisuals/:audiovisual_id', catchAsync(async (req, res) => {
    const { audiovisual_id } = req.params;
    await Audiovisual.findByIdAndDelete(audiovisual_id);
    res.redirect('/audiovisuals');
}));

//REVIEWS ROUTES
app.get('/reviews', catchAsync(async (req, res) => {
    const all_reviews = await Review.find({});
    res.render('reviews/index', { all_reviews });
}));

app.get('/audiovisuals/:audiovisual_id/reviews', catchAsync(async (req, res) => {
    const audiovisual = await Audiovisual.findById(req.params.audiovisual_id).populate('reviews');
    res.render('reviews/showAllReviews', { audiovisual });
}));

app.get('/audiovisuals/:audiovisual_id/reviews/new', catchAsync(async (req, res) => {
    const audiovisual = await Audiovisual.findById(req.params.audiovisual_id);
    res.render('reviews/new', { audiovisual });
}));

app.get('/audiovisuals/:audiovisual_id/reviews/:review_id', catchAsync(async (req, res) => {
    const audiovisual = await Audiovisual.findById(req.params.audiovisual_id);
    const review = await Review.findById(req.params.review_id);
    res.render('reviews/showReview', { audiovisual, review });
}));

app.post('/audiovisuals/:audiovisual_id/reviews', validateReview, catchAsync(async (req, res) => {
    const audiovisual = await Audiovisual.findById(req.params.audiovisual_id);
    const review = new Review(req.body.review);
    if (!review.title) review.title = todayDateFormatted + " - " + audiovisual.title;
    review.date_added = todayDateFormatted;
    audiovisual.reviews.push(review);
    await review.save();
    await audiovisual.save();
    res.redirect(`/audiovisuals/${audiovisual._id}`);
}));

app.delete('/audiovisuals/:audiovisual_id/reviews/:review_id', catchAsync(async (req, res) => {
    const { audiovisual_id, review_id } = req.params;
    await Audiovisual.findByIdAndUpdate(audiovisual_id, { $pull: { reviews: review_id } });
    await Review.findByIdAndDelete(req.params.review_id);
    res.redirect(`/audiovisuals/${audiovisual_id}`);
}));

app.all('*', (req, res, next) => {
    next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "There was an error";
    res.status(statusCode).render('errorTemplates/error', { err });
});

app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000");
});