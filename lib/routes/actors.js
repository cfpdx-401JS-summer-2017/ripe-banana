const express = require('express');
const router = express.Router();
const Actor = require('../../lib/models/actor');
const jsonParser = require('body-parser').json();

router
    .use(jsonParser)
    .post('/', (req, res, next) => {
        const actor = new Actor(req.body);
        actor
            .save()
            .then(actor => res.send(actor))
            .catch(next);

    })
    .get('/', (req, res, next) => {
        Actor.find()
            .lean()
            .select('name')
            .then(actors => res.send(actors))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Actor.findById(req.params.id)
            .lean()
            .select('name dob pob films')
            .populate({
                path: 'film',
                select: 'title'
            })
            .then(actor => {
                if(!actor) res.status(404).send(`cannot GET ${req.params.id}`);
                else res.send(actor);
            })
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Actor.remove()
            .where({ _id: req.params.id})
            .then(response => {
                res.send({ removed: response.result.n === 1});
            })
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Actor.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(actor => res.send(actor))
            .catch(next);
    });

module.exports = router;