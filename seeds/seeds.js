const mongoose = require('mongoose');
const Audiovisual = require('../models/audiovisuals');

const audiovisuals = require('./audiovisual');

mongoose.connect('mongodb://127.0.0.1:27017/meerkat-app');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Database connected successfully");
});

const seedDb = async () => {
    await Audiovisual.deleteMany({});
    audiovisuals.forEach(async audiovisual => {
        const audiovisual_to_add = new Audiovisual(audiovisual);
        await audiovisual_to_add.save();
    });
}

seedDb();