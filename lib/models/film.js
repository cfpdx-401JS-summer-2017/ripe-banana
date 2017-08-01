const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: {
        type: String,
        required: true
    },
    studio: {
        type: Schema.Types.ObjectId,
        ref: 'Studio',
        required: true
    },
    released: {
        type: Number,
        required: true
    },
    cast: [{
        role: String,
        actor: {
            type: Schema.Types.ObjectId,
            ref: 'Actor',
            required: true
        }
    }]

});

schema.statics.existsForActor = function(actorId) {
    return this.find({ actor: actorId })
        .count()
        .then(count => count > 0);
};
schema.statics.existsForStudio = function(studioId) {
    return this.find({ studio: studioId })
        .count()
        .then(count => count > 0);
};

module.exports = mongoose.model('Film', schema);