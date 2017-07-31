
const express = require('express');
const router = express.Router();
const Studio = require('../models/studio');
const jsonParser = require('body-parser').json();

router

    .get('/', (req, res, next) => {
        Studio.find()
            .lean()
            .select('name')
            .then(studios => res.send(studios))
            .catch(next);
    })

    .use(jsonParser)
    
    .post('/', (req, res, next) => {
        new Studio(req.body)
            .save()
            .then(studio => res.send(studio))
            .catch(next);

    });
    
module.exports = router;