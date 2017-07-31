const Router = require('express').Router;
const router = Router();
const Reviewer = require('../models/reviewer');

router
    .get('/', (req, res, next) => {
        Reviewer.find()
            .lean()
            .then(reviewer => res.send(reviewer))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Reviewer.findById(req.params.id)
            .lean()
            .then(reviewer => {
                if (!reviewer) res.status(404).send(`cannot get ${req.params.id}`);
                else res.send(reviewer);
            })
            .catch(next);
    })

    .post('/', (req, res, next) => {
        new Reviewer(req.body)
            .save()
            .then(reviewer => res.send(reviewer))
            .catch(next);
    })


    .put('/:id', (req, res, next) => {
        Reviewer.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(reviewer => res.send(reviewer))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Reviewer.findByIdAndRemove(req.params.id)
            .then(response => res.send({ removed: !!response }))
            .catch(next);
    });

module.exports = router;
