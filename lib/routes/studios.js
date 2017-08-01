const Router = require('express').Router;
const router = Router();
const Studio = require('../models/studio');

router
    .get('/', (req, res, next) => {
        Studio.find()
            .lean()
            .then(studio => res.send(studio))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Studio.findById(req.params.id)
            .lean()
            .then( studio => {
                if(!studio) res.status(404).send(`cannot get ${req.params.id}`);
                else res.send(studio);
            })
            .catch(next);
    })

    .post('/', (req, res, next) => {
        new Studio(req.body)
            .save()
            .then(studio => res.send(studio))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        // delete req.body._id;
        Studio.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(studio => res.send(studio))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Studio.verifyRemove(req.params.id)
            .then(response => res.send({ removed: !!response }))
            .catch(next);
    });

module.exports = router;