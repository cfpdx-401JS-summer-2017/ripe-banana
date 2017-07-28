const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const actSche = new Schema({
    name:{
        type: String,
        required:true
    },
    dob:{
        type: Date
    },
    pob:{
        type: String
    }
},{
    timestamps: true
});
module.exports = mongoose.model('Actor', actSche);