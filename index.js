const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Audiovisual = require('./models/audiovisuals');

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

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/audiovisuals', async (req, res) => {
    const all_audiovisuals = await Audiovisual.find({});
    res.render('audiovisuals/index', { all_audiovisuals });
});

app.get('/audiovisuals/new', (req, res) => {
    res.render('audiovisuals/new')
});

app.post('/audiovisuals', async (req, res) => {
    const audiovisual = new Audiovisual(req.body.audiovisual);
    await audiovisual.save();
    res.redirect(`/audiovisuals/${audiovisual._id}`);
});

app.get('/audiovisuals/:id', async (req, res) => {
    const audiovisual = await Audiovisual.findById(req.params.id);
    res.render('audiovisuals/show', { audiovisual });
});

app.get('/audiovisuals/:id/edit', async (req, res) => {
    const audiovisual = await Audiovisual.findById(req.params.id);
    res.render('audiovisuals/edit', { audiovisual });
});

app.put('/audiovisuals/:id', async (req, res) => {
    const { id } = req.params;
    const audiovisual = await Audiovisual.findByIdAndUpdate(id, { ...req.body.audiovisual });
    res.redirect(`/audiovisuals/${audiovisual._id}`);
});

app.delete('/audiovisuals/:id', async (req, res) => {
    const { id } = req.params;
    await Audiovisual.findByIdAndDelete(id);
    res.redirect('/audiovisuals');
});

app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000");
});