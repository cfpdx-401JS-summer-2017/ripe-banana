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
});