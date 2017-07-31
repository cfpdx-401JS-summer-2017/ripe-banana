const express = require('express');
const router = express.Router();
const Film = require('../models/film');
const jsonParser = require('body-parser').json();

router
    .get('/:id', (req, res, next) => {
        Film.findById(req.params.id)
            .lean()
            .then(film => {
                if(!film) res.status(404).send(`Cannot GET ${req.params.id}`);
                else res.send(film);
            })
            .catch(next);
    })
    .use(jsonParser)
    .post('/', (req, res, next) =>{
        const film = new Film(req.body);
        film
            .save()
            .then(film => res.send(film))
            .catch(next);
    });


module.exports = router;