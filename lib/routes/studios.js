const express = require('express');
const router = express.Router();
const Studio = require('../../lib/models/studio');
const Film = require('../../lib/models/film');
const jsonParser = require('body-parser').json();

router
    .use(jsonParser)
    .post('/', (req, res, next) => {
                
        const studio = new Studio(req.body);
        studio.save()
    // ;})
            .then(studio => res.send(studio))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Studio.getTitles(req.params.id)
            .then(studio => {
                console.log('Where are you!!!', studio);
                if (!studio) res.status(404).send(`Cannot GET ${req.params.id}`);
                else res.send(studio);
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Studio.find()
            .lean()
            .select('name')
            .then(studios => res.send(studios))
            .catch(next);
    })

    .put('/:id', (req, res, next) => {
        Studio.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(studio => res.send(studio))
            .catch(next);//eslint-disable-line
    })


    .delete('/:id', (req, res, next) => {
        Studio.remove(req.params.id)
            .then(studio => res.send({ removed: !!studio }))
            .catch(next);
    })


// .patch('/studios/:id', (req, res, next) => {
//     Studio.findByIdAndUpdate(req.params.id, {
//         $set: req.body
//     }, {
//             new: true,
//             runValidators: true
//         })
//         .then(studio => res.send(studio))
//         .catch(next);//eslint-disable-line
// });

module.exports = router;
