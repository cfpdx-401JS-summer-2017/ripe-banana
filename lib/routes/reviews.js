const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const jsonParser = require('body-parser').json();

router

    .get('/',  (req, res, next) => {
        Review.find()
            .lean()
            .select('__v rating reviewer review film createdAt updatedAt')
            .then(reviews => res.send(reviews))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Review.findById(req.params.id)
            .lean()
            .populate({
                path: 'studio',
                select: 'name'
            })
            .populate({
                path: 'film',
                select: 'title _id' 
            })
            .then(reviews => res.send(reviews))
            .catch(next);
    })

    .use(jsonParser)

    .post('/', (req, res, next) => {
        const review = new Review(req.body);
        review
            .save()
            .then(review=> res.send(review))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        delete req.body._id;
        Review.findByIdAndUpdate(req.params.id, req.body, {new: true})
            .then(review => res.send(review))
            .catch(next);

    })

    .delete('/:id', (req, res, next) => {
        Review.findByIdAndRemove(req.params.id)
            .then(response => res.send({ removed: !!response }))
            .catch(next);
    });

module.exports = router;