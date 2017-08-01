const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const Actor = require('./actor');

const requiredString = {
    type: String,
    required: true
};

const schema = new Schema({
    title: requiredString,
    studio: {
        type: Schema.Types.ObjectId,
        ref: 'Studio',
        required: true
    },
    released: {
        type: Number,
        required: true
    },
    cast: [{
        role: String,
        actor: {
            type: Schema.Types.ObjectId,
            ref: 'Actor',
            required: true
        }
    }]
});

schema.statics.getReviews = function(id) {
    return Promise.all([
        this.findById(id)
            .lean()
            .populate({
                path: 'studio',
                select: 'name'
            }),
        Review.find({ film: id })
            .select('rating review reviewer')
            .lean()
    ])
        .then(([film, reviews]) => {
            console.log('film is', film, 'reviews are', reviews);
            if(film) film.reviews = reviews;
            return film;
        });
};

schema.statics.existsIn = function(actorId) {
    return this.find({ actor: actorId })
        .count()
        .then(count => count > 0);
};

module.exports = mongoose.model('Film', schema);