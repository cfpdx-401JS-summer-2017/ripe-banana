const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe('reviewers model', () => {
    
    before(db.drop);

    it('initial GET returns empty list', () => {
        return request.get('/reviewers')
            .then(req => {
                const reviews = req.body;
                assert.deepEqual(reviews, []);
            });
    });
        
    let rogerEbert = {
        name: 'Roger Ebert',
        company: 'Chicago Sun Times'
    };

    let haleyHales = {
        name: 'Haley Hales',
        company: 'Alchemy Code Lab'
    };

    let mandrewMotterTheOtter = {
        name: 'Mandrew Motter The Otter',
        company: 'Portland Otter Factorie'
    };

    function saveReviewer(reviewer){
        return request
            .post('/reviewers')
            .send(reviewer)
            .then(res => res.body);
    }

    it('roundtrips a new reviewer', () => {
        return saveReviewer(rogerEbert)
            .then(saved => {
                assert.ok(saved._id, 'saved has id');
                rogerEbert = saved;
            })
            .then(() => {
                return request.get(`/reviewers/${rogerEbert._id}`);
            })
            .then(res => res.body)
            .then(got => {
                assert.deepEqual(got, rogerEbert);
            });
    });

    it('GET returns 404 for non-existent id', () => {
        const nonId = '589d04a8b6695bbdfd3106f1';
        return request.get(`/reviewers/${nonId}`)
            .then(
                () => { throw new Error('expected 404');},
                res => {
                    assert.equal(res.status, 404);
                }
            );
    });

    it('returns list of all reviewers', () => {
        return Promise.all([
            saveReviewer(haleyHales),
            saveReviewer(mandrewMotterTheOtter)
        ])

            .then(savedReviewers => {
                haleyHales = savedReviewers[0];
                mandrewMotterTheOtter = savedReviewers[1];
            })
            .then(() => request.get('/reviewers'))
            .then(res => res.body)
            .then(reviewers => {
                assert.isTrue(reviewers.length > 1);
            });
    });

    it('updates reviewer', () => {
        mandrewMotterTheOtter.company = 'The Jerk Store';
        return request.put(`/reviewers/${mandrewMotterTheOtter._id}`)
            .send(mandrewMotterTheOtter)
            .then(res => res.body)
            .then(updated => {
                assert.equal(updated.company, 'The Jerk Store');
            });
    });

    it('deletes a reviewer', () => {
        return request.delete(`/reviewers/${mandrewMotterTheOtter._id}`)
            .then(res => res.body)
            .then(result => {
                assert.isTrue(result.removed);
            });
    });

    it('delete a non-existent reviewer is removed false', () => {
        return request.delete(`/reviews/${mandrewMotterTheOtter._id}`)
            .then(res => res.body)
            .then(result => {
                assert.isFalse(result.removed);
            });
    });

    it('errors on validation failure', () => {
        return saveReviewer({})
            .then(
                () => { throw new Error('unexpected failure');},
                (errors) => {
                    assert.equal(errors.status, 400);
                }

            );
    });
});