const assert = require('chai').assert;
const Review = require('../../lib/models/review');
const Film = require('../../lib/models/film');
const Reviewer = require('../../lib/models/reviewer');

const expectedValidation = () => {throw new Error('expected validation errors');};

describe('Review models', () => {
    const reviewer = new Reviewer({name:'Roger Ebert', company:'Chicago Sun Times'});
    const film = new Film({title:'Mulholland Drive', studio:'Universal Pictures', released:2001});

    it('validates good model', () => {
        const review = new Review({rating:5, reviewer:reviewer._id, content:'Mulholland Drive is really good.',film: film._id});
        return review.validate();
    });

    describe('validation failures', () => {

        it('rating, reviewer, content, film are required', () => {
            const review = new Review();
            return review.validate()
                .then(expectedValidation,
                    err => {
                        const errors = err.errors;
                        assert.ok(errors.rating && errors.rating.kind === 'required');
                        assert.ok(errors.reviewer && errors.reviewer.kind === 'required');
                        assert.ok(errors.content && errors.content.kind === 'required');
                        assert.ok(errors.film && errors.film.kind === 'required');
                    });
        });
        
        it('has at least 1 star', () => {
            const review = new Review({rating:0, reviewer:reviewer._id, content:'Mulholland Drive is really good.',film: film._id});
            return review.validate()
                .then(expectedValidation,
                    err => {
                        const errors = err.errors;
                        assert.ok(errors.rating && errors.rating.kind === 'min');
                    });
        });

        it('has no more than 5 stars', () => {
            const review = new Review({rating:6, reviewer:reviewer._id, content:'Mulholland Drive is really good.',film: film._id});
            return review.validate()
                .then(expectedValidation,
                    err => {
                        const errors = err.errors;
                        assert.ok(errors.rating && errors.rating.kind === 'max');
                    });
        });

        it('has no more than 140 characters', () => {
            const review = new Review({
                rating:2,
                reviewer:reviewer._id,
                content:'Mulholland Drive is really goooooddddddddddddddddddddddddddd. I love it so much that this review will be longer than your typical average boring old Tweet, because I am an old man Roger Ebert and I have always been old. I was born a wrinkly old baby like Benjamin Button but my movie reviews are very insightful, even my review of the first Pokemon movie.',
                film: film._id
            });
            return review.validate()
                .then(expectedValidation,
                    err => {
                        const errors = err.errors;
                        assert.ok(errors.content && errors.content.kind === 'maxlength');
                    });
        });

    });
});