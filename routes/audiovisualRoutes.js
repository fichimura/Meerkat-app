const express = require('express');
const router = express.Router({ mergeParams: true });
const Audiovisual = require('../models/audiovisuals');
const { audiovisualSchema } = require('../JoiSchemas/JoiSchemas');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');
const { isSignedIn } = require('../middleware');
const todayDate = new Date();
const todayDateFormatted = todayDate.getFullYear() + "-" + (todayDate.getMonth() + 1) + "-" + todayDate.getDate();

//Middleware
const validateAudiovisual = (req, res, next) => {
    const { error } = audiovisualSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


router.get('/', catchAsync(async (req, res) => {
    const all_audiovisuals = await Audiovisual.find({}).populate('author');
    res.render('audiovisuals/index', { all_audiovisuals });
}));

router.get('/new', isSignedIn, (req, res) => {
    res.render('audiovisuals/new');
});

router.post('/', isSignedIn, validateAudiovisual, catchAsync(async (req, res) => {
    req.body.audiovisual.date_added = todayDateFormatted;
    const audiovisual = new Audiovisual(req.body.audiovisual);
    audiovisual.author = req.user._id;
    await audiovisual.save();
    req.flash('success', 'Successfully made an audiovisual');
    res.redirect(`/audiovisuals/${audiovisual._id}`);
}));

router.get('/:audiovisual_id', catchAsync(async (req, res, next) => {
    const audiovisual = await Audiovisual.findById(req.params.audiovisual_id).populate('author');
    if (!audiovisual) {
        req.flash('error', 'Cannot find audiovisual');
        return res.redirect('/audiovisuals');
    }
    res.render('audiovisuals/show', { audiovisual });
}));

router.get('/:audiovisual_id/edit', isSignedIn, catchAsync(async (req, res) => {
    const audiovisual = await Audiovisual.findById(req.params.audiovisual_id);
    if (!audiovisual) {
        req.flash('error', 'Cannot find audiovisual');
        return res.redirect('/audiovisuals');
    }
    res.render('audiovisuals/edit', { audiovisual });
}));

router.put('/:audiovisual_id', isSignedIn, validateAudiovisual, catchAsync(async (req, res) => {
    const { audiovisual_id } = req.params;
    const audiovisual = await Audiovisual.findByIdAndUpdate(audiovisual_id, { ...req.body.audiovisual });
    req.flash('success', 'Successfully updated audiovisual');
    res.redirect(`/audiovisuals/${audiovisual._id}`);
}));

router.delete('/:audiovisual_id', isSignedIn, catchAsync(async (req, res) => {
    const { audiovisual_id } = req.params;
    await Audiovisual.findByIdAndDelete(audiovisual_id);
    req.flash('success', 'Successfully deleted audiovisual')
    res.redirect('/audiovisuals');
}));


module.exports = router;