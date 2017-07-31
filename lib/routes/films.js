const express = require('express');
const router = express.Router();
const Film = require('../../lib/models/film');
const jsonParser = require('body-parser').json();

router
    .use(jsonParser)
    .post('/', (req, res, next) => {
        new Film(req.body)
            .save()
            .then(film => res.send(film))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Film.getReviews(req.params.id)
            .then(film => {
                if(!film) res.status(404).send(`Cannot GET ${req.params.id}`);
                else res.send(film);
            })
            .catch(next);
    })
    .get('/', (req, res, next) => {
        Film.find()
            .lean()
            .select('title released studio')
            .populate({
                path: 'studio',
                select: 'name'
            })
            .then(films => {
                res.send(films);
            })
            .catch(next);
    })
    .delete('/:id', (req, res, next) => {
        Film.remove()
            .where({ _id: req.params.id })
            .then(response => {
                res.send({ removed: response.result.n === 1 });
            })
            .catch(next);
    })
    .put(':/id', (req, res, next) => {
        Film.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(film => res.send(film))
            .catch(next);
    });


module.exports = router;