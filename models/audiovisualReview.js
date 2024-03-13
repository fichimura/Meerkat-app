const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const audiovisualReviewSchema = new Schema({
    rating: {
        type: Number,
        required: [true, "A review must have a rating."]
    },
    where: String,
    when: Date,
    favorite: Boolean,
    notes: String,
});

module.exports = mongoose.model('Review', audiovisualReviewSchema);
