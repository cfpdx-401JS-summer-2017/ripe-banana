const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    }
});

module.exports = mongoose.model('Studio', schema);