const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Film = require('./film');

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        city: String,
        state: String,
        country: String
    }
});

schema.statics.verifyRemove = function(id) {
    return Film.existsForStudio(id)
        .then(exists => {
            if(exists) {
                throw {
                    code: 400,
                    error: 'cannot remove studio when it has films'
                };
            }
            else return this.findByIdAndRemove(id);
        });
};

module.exports = mongoose.model('Studio', schema);