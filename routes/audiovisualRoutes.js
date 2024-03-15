const express = require('express');
const router = express.Router({ mergeParams: true });
const Audiovisual = require('../models/audiovisuals');
const { audiovisualSchema } = require('../JoiSchemas/JoiSchemas');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');
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
    const all_audiovisuals = await Audiovisual.find({});
    res.render('audiovisuals/index', { all_audiovisuals });
}));

router.get('/new', (req, res) => {
    res.render('audiovisuals/new')
});

router.post('/', validateAudiovisual, catchAsync(async (req, res) => {
    req.body.audiovisual.date_added = todayDateFormatted;
    const audiovisual = new Audiovisual(req.body.audiovisual);
    await audiovisual.save();
    res.redirect(`/audiovisuals/${audiovisual._id}`);
}));

router.get('/:audiovisual_id', catchAsync(async (req, res, next) => {
    const audiovisual = await Audiovisual.findById(req.params.audiovisual_id);
    res.render('audiovisuals/show', { audiovisual });
}));

router.get('/:audiovisual_id/edit', catchAsync(async (req, res) => {
    const audiovisual = await Audiovisual.findById(req.params.audiovisual_id);
    res.render('audiovisuals/edit', { audiovisual });
}));

router.put('/:audiovisual_id', validateAudiovisual, catchAsync(async (req, res) => {
    const { audiovisual_id } = req.params;
    const audiovisual = await Audiovisual.findByIdAndUpdate(audiovisual_id, { ...req.body.audiovisual });
    res.redirect(`/audiovisuals/${audiovisual._id}`);
}));

router.delete('/:audiovisual_id', catchAsync(async (req, res) => {
    const { audiovisual_id } = req.params;
    await Audiovisual.findByIdAndDelete(audiovisual_id);
    res.redirect('/audiovisuals');
}));


module.exports = router;