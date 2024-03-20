const Audiovisual = require('../models/audiovisuals');
const todayDate = new Date();
const todayDateFormatted = todayDate.getFullYear() + "-" + (todayDate.getMonth() + 1) + "-" + todayDate.getDate();

module.exports.index = async (req, res) => {
    const all_audiovisuals = await Audiovisual.find({}).populate('author');
    res.render('audiovisuals/index', { all_audiovisuals });
};

module.exports.renderNewForm = (req, res) => {
    res.render('audiovisuals/new');
};

module.exports.createAudiovisual = async (req, res) => {
    req.body.audiovisual.date_added = todayDateFormatted;
    const audiovisual = new Audiovisual(req.body.audiovisual);
    audiovisual.author = req.user._id;
    await audiovisual.save();
    req.flash('success', 'Successfully made an audiovisual');
    res.redirect(`/audiovisuals/${audiovisual._id}`);
};

module.exports.showAudiovisual = async (req, res, next) => {
    const audiovisual = await Audiovisual.findById(req.params.audiovisual_id).populate('author');
    if (!audiovisual) {
        req.flash('error', 'Cannot find audiovisual');
        return res.redirect('/audiovisuals');
    }
    res.render('audiovisuals/show', { audiovisual });
};

module.exports.showEditAudiovisual = async (req, res) => {
    const audiovisual = await Audiovisual.findById(req.params.audiovisual_id);
    if (!audiovisual) {
        req.flash('error', 'Cannot find audiovisual');
        return res.redirect('/audiovisuals');
    }
    res.render('audiovisuals/edit', { audiovisual });
};

module.exports.editAudiovisual = async (req, res) => {
    const { audiovisual_id } = req.params;
    const audiovisual = await Audiovisual.findByIdAndUpdate(audiovisual_id, { ...req.body.audiovisual });
    req.flash('success', 'Successfully updated audiovisual');
    res.redirect(`/audiovisuals/${audiovisual._id}`);
};

module.exports.deleteAudiovisual = async (req, res) => {
    const { audiovisual_id } = req.params;
    await Audiovisual.findByIdAndDelete(audiovisual_id);
    req.flash('success', 'Successfully deleted audiovisual')
    res.redirect('/audiovisuals');
};