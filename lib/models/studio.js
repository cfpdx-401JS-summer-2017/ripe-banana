const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Film = require('./film');

const requiredString = {
    type: String,
    required: true
};

const schema = new Schema({
    name: requiredString,
    address: {
        city: String,
        state: String,
        country: String
    }, 
    // film: Film.schema
});

schema.statics.getTitles = function(id) {
    return Promise.all([
        this.findById(id)
            .lean(),
        Film.find({ studio: id })
            .select('film.title')
            .lean()    
    ])
        .then(([films, title]) => {
            if(films) films.films = title;
            return films;
        });
};
module.exports = mongoose.model('Studio', schema);