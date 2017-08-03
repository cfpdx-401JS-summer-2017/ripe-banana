const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    content: {
        type: String,
        required: true,
        maxlength: 140
    },
    film: {
        type: Schema.Types.ObjectId,
        ref: 'Film',
        required: true
    }
}, {
    timestamps: true
});

schema.static('getAvg', function () {
    return this.aggregate([
        { $unwind: '$rating' },
        { $group: {
            _id: '$_id',
            film: { $first: ''}
        }}  
    ]);
});