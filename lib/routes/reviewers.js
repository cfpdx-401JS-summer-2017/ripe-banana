const Router = require('express').Router;
const router = Router();
const Reviewer = require('../../lib/models/reviewer');
const jsonParser = require('body-parser').json();

router
    .post('/', jsonParser, (req, res, next) => {
        new Reviewer(req.body)
            .save()
            .then(reviewer => res.send(reviewer))
            .catch(next);
    })

    // TODO: check that this makes array with film data
    .get('/:id', (req, res, next) => {
        Reviewer.getReviews(req.params.id)
            .then(reviewer => {
                if(!reviewer) res.status(404).send(`Cannot GET ${req.params.id}`);
                else res.send(reviewer);
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Reviewer.find()
            .lean()
            .select('name company _id __v')
            .then(reviewers => res.send(reviewers))
            .catch(next);
    })

    .patch('/:id', jsonParser, (req, res, next) => {
        Reviewer.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            {
                new: true,
                runValidators: true
            })
            .then(reviewer => res.send(reviewer))
            .catch(next);
    });


module.exports = router;