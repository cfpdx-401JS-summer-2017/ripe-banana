const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requiredString = {
    type: String,
    required: true
};

const schema = new Schema({
    name: requiredString,
    dob: Date,
    pob: String
});

module.exports = mongoose.model('Actor', schema);