const Router = require('express').Router;
const router = Router();
const Film = require('../models/film');

router
    .get('/', (req, res, next) => {
        Film.find()
            .lean()
            .then(film => res.send(film))
            .catch(next)
    })

    .get('/:id', (req, res, next) => {
        Film.findById(req.params.id)
            .lean()
            .then(film => {
                if (!film) res.status(404).send(`cannot get ${req.params.id}`);
                else res.send(film);
            })
            .catch(next);
    })

    .post('/', (req, res, next) => {
        new Film(req.body)
            .save()
            .then(film => res.send(film))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        // delete req.body._id;
        Film.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(film => res.send(film))
            .catch(next);
    })

    .delete(':/id', (res, req, next) => {
        Film.findByIdAndRemove(req.params.id)
            .then(response => res.send({ removed: !!response }))
            .catch(next);
    });

module.exports = router;