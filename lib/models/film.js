const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//console.log('Da Studio => ',Studio.schema);
console.log('da Actors =>',Schema.Types.String);

const filSche = new Schema({
    title: {
        type: String,
        required: true
    },
    released: {
        type: Date,
        required: true
    },
    studio: {
        type: Schema.Types.ObjectId,
        ref: 'Studio',
        required: true
    },
    
    cast: [{
        actor: {
            type: Schema.Types.ObjectId,
            ref: 'Actor',
            required: true
        },
        role: {
            type: String
        }
    }]
});
//static funtion may be needed to prevent actors from beeing deleted when 
//they have a film they were in still in the database

module.exports = mongoose.model('Film', filSche);