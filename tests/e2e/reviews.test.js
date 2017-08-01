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

    let banwarTheSanwar = {
        name: 'The Banwar of Sanwar',
        company: 'Hugedorks.com'
    };

    let haleyHales = {
        name: 'Haley Hales',
        company: 'Alchemy Code Lab'
    };

    let mandrewMotterTheOtter = {
        name: 'Mandrew Motter The Otter',
        company: 'Portland Otter Factorie'
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
//eslint-disable-next-line
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

    it('GET returns 404 for non-existent id', () => {
        const nonId = '589d04a8b6695bbdfd3106f1';
        return request.get(`/reviews/${nonId}`)
            .then(
                () => {throw new Error('expected 404');},
                res => {
                    assert.equal(res.status, 404);
                }
            );
    });

    it('returns list of all reviews', () => {
        let mulhollandDriveReview2 = {
            rating: 3,
            reviewer: haleyHales._id,
            content: 'Not enough cats.',
            film: mulhollandDrive._id
        };
        let mulhollandDriveReview3 = {
            rating: 2,
            reviewer: mandrewMotterTheOtter._id,
            content: 'I did not see it.',
            film: mulhollandDrive._id
        };

        return Promise.all([
            saveReview(mulhollandDriveReview2),
            saveReview(mulhollandDriveReview3)
        ])
            .then(savedReview => {
                mulhollandDriveReview2 = savedReview[1];
                mulhollandDriveReview3 = savedReview[2];
            })
            .then(() => request.get('/reviews'))
            .then(res => res.body)
            .then(review => {
                assert.isTrue(review.length > 1);
            });

    });

    it('updates a review', () => {
        let mulhollandDriveReview4 = {
            rating: 1,
            reviewer: banwarTheSanwar._id,
            content: 'Sanwars do not have eyes.',
            film: mulhollandDrive._id
        };
        saveReview(mulhollandDriveReview4)
            .then( () => {
                mulhollandDriveReview4.rating = 5;
                return request.put(`reviews/${mulhollandDriveReview4._id}`)
                    .send(mulhollandDriveReview4)
                    .then(res => res.body)
                    .then( updated => {
                        assert.equal(updated.rating, mulhollandDriveReview4.rating);
                    });
            });
    });

    it('deletes a review', () => {
        let mulhollandDriveReview5 = {
            rating: 4,
            reviewer: banwarTheSanwar._id,
            content: 'There has been an awful mistake',
            film: mulhollandDrive._id
        };
        saveReview(mulhollandDriveReview5)
            .then( () => {
                return request.delete(`/reviews/${mulhollandDriveReview5._id}`)
                    .then( res => res.body)
                    .then(result => {
                        assert.isTrue(result.removed);
                    });
            });
    });

    it('deletes a non-existent studio removed false', () => {
        return request.delete('/reviews/589d04a8b6695bbdfd3106f1')
            .then(res => res.body)
            .then(result => {
                assert.isFalse(result.removed);
            });
    });

    it('errors on validation failure', () => {
        return saveReview({})
            .then(
                () => { throw new Error('expected failure');},
                () => { }
            );
    });
});