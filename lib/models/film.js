// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
// const Actor = require('./actor');
// const Studio = require('./studio');

// const filSche = new Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     released: {
//         type: Date,
//         required: true
//     },
//     studio: Studio.schema._id,
//     cast: [{
//         actor: Actor.schema,
//         role: {
//             type: String
//         }
        
//     }]
// });
// //static funtion may be needed to prevent actors from beeing deleted when 
// //they have a film they were in still in the database

// module.exports = mongoose.model('Film', filSche);