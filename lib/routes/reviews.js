const Router = require('express').Router;
const router = Router();
const Review = require('../../lib/models/review');
const jsonParser = require('body-parser').json();

router
    .post('/', jsonParser, (req, res, next) => {
        new Review(req.body)
            .save()
            .then(review => {
                res.send(review);
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Review.find()
            .lean()
            .populate({
                path: 'film',
                select: 'title',
                options: { limit: 100 }
            })
            .select('rating review film')
            .then(reviews => {
                res.send(reviews);
            })
            .catch(next);
    })
    .patch('/:id', jsonParser, (req, res, next) => {
        Review.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },
        { new: true, runValidators: true })
            .then(review => res.send(review))
            .catch(next);
    });

module.exports = router;