const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Film = require('./film');

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    dob: Date,
    pob: String
});

schema.statics.verifyRemove = function(id) {
    return Film.existsForActor(id)
        .then(exists => {
            if(exists) {
                throw {
                    code: 400,
                    error: 'cannot remove actor when it has films'
                };
            }
            else return this.findByIdAndRemove(id);
        });
};

module.exports = mongoose.model('Actor', schema);