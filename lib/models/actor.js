const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Film = require('./film');

const requiredString = {
    type: String,
    required: true
};

const schema = new Schema({
    name: requiredString,
    dob: Date,
    pob: String
});

schema.statics.verifyRemove = function(id) {
    return Film.existsIn(id)
        .then(exists => {
            if(exists) {
                throw {
                    code: 400,
                    error: 'Cannot remove actor in films'
                };
            }
            else return this.findByIdAndRemove(id);
        });
};

module.exports = mongoose.model('Actor', schema);