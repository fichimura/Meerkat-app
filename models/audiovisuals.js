const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AudiovisualSchema = new Schema({
    type: String,
    title: String,
    director: String,
    main_cast: String,
    country: String,
    date_added: String,
    release_year: String,
    rating: String,
    duration: String,
    listed_in: String,
    description: String,
});

module.exports = mongoose.model('Audiovisual', AudiovisualSchema);
