const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Movie = require('./models/movie');

mongoose.connect('mongodb://127.0.0.1:27017/meerkat-app');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Database connected successfully");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/newMovie', async (req, res) => {
    const movie = new Movie({ title: "Ratatouille", year: '2007' });
    await movie.save();
    res.send(movie);
});

app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000");
});