const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe('reviews route', () => {
    before(db.drop);

    it('initial GET returns empty list', () => {
        return request.get('/reviews')
            .then(req => {
                const reviews = req.body;
                assert.deepEqual(reviews, []);
            });
    });

    let rogerEbert = {
        name: 'Roger Ebert',
        company: 'Chicago Sun Times'
    };

    let naomiWatts = {
        name: 'Naomi Watts',
        dob: new Date('1968-09-28'),
        pob: 'Shoreham, England'
    };
    let lauraElenaHarring = {
        name: 'Laura Elena Harring',
        dob: new Date('1964-03-03'),
        pob: 'Los Mochis, Mexico'
    };
    let universal = {
        name: 'Universal Studios',
        city: 'Los Angeles',
        state: 'California',
        country: 'USA'
    };
    let mulhollandDrive = {
        title: 'Mulholland Drive',
        studio: universal._id,
        released: 2001,
        cast: [
            naomiWatts._id,
            lauraElenaHarring._id
        ]
    };

    function saveReviewer(reviewer) {
        return request.post('/reviewers')
            .send(reviewer)
            .then(res => {
                reviewer._id = res.body._id;
                return res.body;
            });
    }

    function saveActor(actor) {
        return request.post('/actors')
            .send(actor)
            .then(res => {
                actor._id = res.body._id;
                return res.body;
            });
    }

    function saveStudio(studio) {
        return request
            .post('/studios')
            .send(studio)
            .then(res => {
                studio._id = res.body._id;
                return res.body;
            });
    }

    function saveFilm(film, studio = universal, cast = [naomiWatts, lauraElenaHarring]) {
        film.studio = studio._id;
        film.cast = [{
            actor: naomiWatts
        }, {
            actor: lauraElenaHarring
        }];
        return request.post('/films')
            .send(film)
            .then(res => {
                film._id = res.body._id;
                return res.body;
            });
    }

    before(() => {
        return Promise.all([
            saveReviewer(rogerEbert),
            saveActor(naomiWatts),
            saveActor(lauraElenaHarring),
            saveStudio(universal),
        ]);
    });

    before(() => saveFilm(mulhollandDrive));


    function saveReview(review, reviewer = rogerEbert, film = mulhollandDrive) {
        review.reviewer = reviewer._id;
        review.film = film._id;
        return request
            .post('/reviews')
            .send(review)
            .then(res => {
                review._id = res.body._id;
                return res.body;
            });
    }

    it('roundtrips a new review', () => {
        let mulhollandDriveReview = {
            rating: 5,
            reviewer: rogerEbert._id,
            content: 'David Lynch has been working toward Mulholland Drive all of his career, and now that he’s arrived there I forgive him Wild at Heart and...',
            film: mulhollandDrive._id
        };

        return saveReview(mulhollandDriveReview, rogerEbert, mulhollandDrive)
            .then(saved => {
                assert.ok(saved._id, 'saved has id');
                mulhollandDriveReview = saved;
            })
            .then(() => {
                return request.get(`/reviews/${mulhollandDriveReview._id}`);
            })
            .then(res => res.body)
            .then(got => {
                assert.deepEqual(got, mulhollandDriveReview);
            });
    });
});