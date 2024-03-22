const mongoose = require('mongoose');
const Review = require('./audiovisualReview');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const AudiovisualSchema = new Schema({
    type: {
        type: String,
        required: [true, "Audiovisual must have a type."]
    },
    images: [ImageSchema],
    title: {
        type: String,
        required: [true, "Audiovisual must have a title."]
    },
    director: String,
    main_cast: String,
    country: String,
    date_added: String,
    release_year: Number,
    duration: String,
    listed_in: String,
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

AudiovisualSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Audiovisual', AudiovisualSchema);
