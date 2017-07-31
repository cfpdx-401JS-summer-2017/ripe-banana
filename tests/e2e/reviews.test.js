const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe('reviews route', () => {
    before(db.drop);

    let reviewer = null;
    let actor1 = null;
    let actor2 = null;
    let film = null;

    before(() => {
        return request.post('/reviewers')
        
    });

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

    function saveReviewer(reviewer) {
        return request
            .post('/reviewers')
            .send(reviewer)
            .then(res => res.body)
            .then(data => {
                reviewer._id = data._id;
            });
    }

    saveReviewer(rogerEbert);

    let naomiWatts = {
        name: 'Naomi Watts',
        dob: 1968-09-28,
        pob: 'Shoreham, England'
    };

    let lauraElenaHarring = {
        name: 'Laura Elena Harring',
        dob: 1964-03-03,
        pob: 'Los Mochis, Mexico'
    };

    function saveActor(actor) {
        return request
            .post('/actors')
            .send(actor)
            .then(res => res.body)
            .then(data => {
                actor._id = data._id;
                console.log('ACTOR!!!', actor);
            });
    }

    saveActor(naomiWatts);
    saveActor(lauraElenaHarring);
    
    let mulhollandDrive = {
        title: 'Mulholland Drive',
        studio: 'Universal Pictures',
        released: 2001,
        cast: [
            naomiWatts._id,
            lauraElenaHarring._id
        ]
    };

    function saveFilm(film) {
        console.log('*** naomiWatts._id', naomiWatts._id);
        return request
            .post('/films')
            .send(film)
            .then(res => res.body)
            .then(data => {
                film._id = data._id;
            });
    }

    saveFilm(mulhollandDrive);
    
    let mulhollandDriveReview = {
        rating: 5,
        reviewer: rogerEbert._id,
        content: 'David Lynch has been working toward Mulholland Drive all of his career, and now that he’s arrived there I forgive him Wild at Heart and...',
        film: mulhollandDrive._id
    };

    function saveReview(review) {
        return request
            .post('/reviews')
            .send(review)
            .then(res => res.body);
    }

    it('roundtrips a new review', () => {
        console.log('*** rogerEbert._id', rogerEbert._id);
        console.log('*** mulhollandDrive._id', mulhollandDrive._id);
        return saveReview(mulhollandDriveReview)
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

    after(db.drop);
});