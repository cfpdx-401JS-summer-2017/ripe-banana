const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

process.env.MONGODB_URL = 'mongodb://localhost:27017/bananas-test';
require('../../lib/connect');

const connection = require('mongoose').connection;
const app = require('../../lib/app');
const request = chai.request(app);

describe('REST API for reviews', () => {

    before(() => connection.dropDatabase());

    const revOne = {
        rating: 3,
        reviewer: '123412345567898765466676',
        review: 'It was okay. Could have been better. Oh well.',
        film: '123412345567898765466676'
    };

    const revTwo = {
        rating: 4,
        reviewer: '123412345567898765466676',
        review: 'Yay!',
        film: '123412345567898765466676'
    };

    const revThree = {
        rating: 1,
        reviewer: '123412345567898765466676',
        review: 'Blarg.',
        film: '123412345567898765466676'
    };

    function saveReview(review) {
        return request.post('/reviews')
            .send(review)
            .then(({ body }) => {
                review._id = body._id;
                review.__v = body.__v;
                review.rating = body.rating;
                review.reviewer = body.reviewer;
                review.review = body.review;
                review.film = body.film;
                review.createdAt = body.createdAt;
                review.updatedAt = body.updatedAt;
                return review;
            });
    }

    it('saves a review', () => {
        return saveReview(revOne)
            .then(savedRev => {
                assert.ok(savedRev._id);
                assert.deepEqual(savedRev, revOne);
            });
    });
    
    it('GETs up to 100 reviews', () => {
        return Promise.all([
            saveReview(revTwo),
            saveReview(revThree)
        ])
            .then(res => {
                const reviews = res.sort((a, b) => {
                    if(a.updatedAt > b.updatedAt) return 1;
                    else if(a.updatedAt < b.updatedAt) return -1;
                    else return 0;
                });
                assert.deepEqual(reviews, [revTwo, revThree]);
            });
    });

    it('updates a review by id', () => {
        return request.patch(`/reviews/${revThree._id}`)
            .send({ rating: 5 })
            .then( res => res.body)
            .then(review => {
                console.log('review is', review);
                assert.equal(review.rating, 5);
            });
    });
});