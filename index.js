const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Audiovisual = require('./models/audiovisuals');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/expressError');
const { audiovisualSchema } = require('./JoiSchemas/audiovisualJoiSchema');
const Review = require('./models/audiovisualReview');

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

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/audiovisuals', catchAsync(async (req, res) => {
    const all_audiovisuals = await Audiovisual.find({});
    res.render('audiovisuals/index', { all_audiovisuals });
}));

app.get('/audiovisuals/new', (req, res) => {
    res.render('audiovisuals/new')
});

app.post('/audiovisuals', validateAudiovisual, catchAsync(async (req, res) => {
    const todayDate = new Date();
    req.body.audiovisual.date_added = todayDate.getFullYear() + "-" + (todayDate.getMonth() + 1) + "-" + todayDate.getDate();
    const audiovisual = new Audiovisual(req.body.audiovisual);
    await audiovisual.save();
    res.redirect(`/audiovisuals/${audiovisual._id}`);
}));

app.get('/audiovisuals/:id', catchAsync(async (req, res, next) => {
    const audiovisual = await Audiovisual.findById(req.params.id);
    res.render('audiovisuals/show', { audiovisual });
}));

app.get('/audiovisuals/:id/edit', catchAsync(async (req, res) => {
    const audiovisual = await Audiovisual.findById(req.params.id);
    res.render('audiovisuals/edit', { audiovisual });
}));

app.get('/audiovisuals/:id/reviews', catchAsync(async (req, res) => {
    const audiovisual = await Audiovisual.findById(req.params.id);
    res.render('reviews/show', { audiovisual });
}));

app.post('/audiovisuals/:id/reviews', catchAsync(async (req, res) => {
    const audiovisual = await Audiovisual.findById(req.params.id);
    const review = new Review(req.body.review);
    audiovisual.reviews.push(review);
    await review.save();
    await audiovisual.save();
    res.redirect(`/audiovisuals/${audiovisual._id}`);
}));

app.put('/audiovisuals/:id', validateAudiovisual, catchAsync(async (req, res) => {
    const { id } = req.params;
    const audiovisual = await Audiovisual.findByIdAndUpdate(id, { ...req.body.audiovisual });
    res.redirect(`/audiovisuals/${audiovisual._id}`);
}));

app.delete('/audiovisuals/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Audiovisual.findByIdAndDelete(id);
    res.redirect('/audiovisuals');
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