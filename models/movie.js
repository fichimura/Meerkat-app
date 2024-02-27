const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    title: String,
    year: String,
    description: String,
    main_cast: String,
    direction: String,
    genders: String
});

module.exports = mongoose.model('Movie', MovieSchema);
