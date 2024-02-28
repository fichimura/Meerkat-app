const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Audiovisual = require('./models/audiovisuals');
const audiovisuals = require('./models/audiovisuals');

mongoose.connect('mongodb://127.0.0.1:27017/meerkat-app');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Database connected successfully");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

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

app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000");
});