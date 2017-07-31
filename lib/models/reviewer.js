const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const requiredString = {
    type: String,
    required: true
};

const schema = new Schema({
    name: requiredString,
    company: requiredString
});

schema.statics.getReviews = function(id) {
    return Promise.all([
        this.findById(id)
            .lean(),
        Review.find({ film: id })
            .select('film.title rating review')
            .lean()    
    ])
        .then(([reviewer, reviews]) => {
            if(reviewer) reviewer.reviews = reviews;
            return reviewer;
        });
};

module.exports = mongoose.model('Reviewer', schema);