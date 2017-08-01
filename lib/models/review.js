const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requiredString = {
    type: String,
    required: true,
    maxlength: 140
};

const schema = new Schema({
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    reviewer: {
        type: Schema.Types.ObjectId,
        ref: 'Reviewer',
        required: true
    },
    review: requiredString,
    film: {
        type: Schema.Types.ObjectId,
        ref: 'Film',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Review', schema);