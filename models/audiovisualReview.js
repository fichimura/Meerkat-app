const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const audiovisualReviewSchema = new Schema({
    title: String,
    rating: {
        type: Number,
        required: [true, "A review must have a rating."]
    },
    where: String,
    when: Number,
    favorite: Boolean,
    notes:
    {
        type: String,
        required: [true, "A note about the audiovisual must be provided"]
    },
    date_added: Date
});

module.exports = mongoose.model('Review', audiovisualReviewSchema);
