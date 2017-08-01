const { assert } = require('chai');
const Review = require('../../lib/models/review');
const Reviewer = require('../../lib/models/reviewer');
const Film = require('../../lib/models/film');

describe('Review Model unit tests', () => {
    const reviewer = new Reviewer({ name: 'Marty Baller', company: 'Balling Corporation' });
    const film = new Film({
        title: 'Finding Nemo',
        studio: '123456789009876543211234',
        released: 2003,
        cast: [
            { role: 'Nemo', actor: '123456789098765432123456' },
            { role: 'Dory', actor: '123456789098765432123456' },
            { role: 'Marlin', actor: '123456789098765432123456' }
        ]
    });

    it('validates the review model and required fields', () => {
        const review = new Review({
            rating: 2,
            reviewer: reviewer._id,
            review: 'It was aight!!!!',
            film: film._id,
            createdAt: new Date,
            updatedAt: new Date
        });
        return review.validate();
    });

    it('fails validation when required fields are missing', () => {
        const review = new Review();
        return review.validate()
            .then(
                () => { throw new Error('Expected validation error'); },
                ({ errors }) => {
                    assert.ok(errors.rating.kind);
                    assert.ok(errors.reviewer.kind);
                    assert.ok(errors.review.kind);
                    assert.ok(errors.film.kind);
                });
    });

    it('Rating should be of Number type', () => {
        const review = new Review({
            rating: 'fake',
            reviewer: reviewer._id,
            review: 'It was aight!!!!',
            film: film._id,
            createdAt: new Date,
            updatedAt: new Date
        });
        return review.validate()
            .then(
                () => { throw new Error('Expected validation error'); },
                ({ errors }) => assert.equal(errors.rating.kind, 'Number')
            );
    });

    it('Rating should have max of 5', () => {
        const review = new Review({
            rating: 10,
            reviewer: reviewer._id,
            review: 'It was aight!!!!',
            film: film._id,
            createdAt: new Date,
            updatedAt: new Date
        });
        return review.validate()
            .then(
                () => { throw new Error('Expected validation error'); },
                ({ errors }) => assert.equal(errors.rating.kind, 'max')
            );
    });

    it('Rating should have min of 1', () => {
        const review = new Review({
            rating: 0,
            reviewer: reviewer._id,
            review: 'It was aight!!!!',
            film: film._id,
            createdAt: new Date,
            updatedAt: new Date
        });
        return review.validate()
            .then(
                () => { throw new Error('Expected validation error'); },
                ({ errors }) => assert.equal(errors.rating.kind, 'min')
            );
    });
});