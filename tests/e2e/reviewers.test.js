const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

process.env.MONGODB_URI = 'mongodb://localhost:27017/ripe-banana-test';

require('../../lib/connect');

const connection = require('mongoose').connection;

const app = require('../../lib/app');
const request = chai.request(app);

describe('reviewer REST api', () => {

    before(() => connection.dropDatabase());

    it('initial /GET returns empty list', () => {
        return request.get('/reviewers')
            .then(req => {
                const reviewers = req.body;
                assert.deepEqual(reviewers, []);
            });
    });

    let manohla = {
        name: 'Manohla Dargis',
        company: 'NY Times'
    };

    let david = {
        name: 'David Edelstein',
        company: 'Vulture'
    };

    let jeffrey = {
        name: 'Jeffrey M. Anderson',
        company: 'Common Sense Media'
    };

    function saveReviewer(reviewer) {

        return request.post('/reviewers')
            .send(reviewer)
            .then(res => res.body);
    }

    it('roundtrips a new reviewer', () => {
        return saveReviewer(manohla)
            .then(saved => {
                assert.ok(saved._id, 'saved has id');
                manohla = saved;
            })
            .then(() => {
                return request.get(`/reviewers/${manohla._id}`);
            })
            .then(res => res.body)
            .then(got => {
                assert.deepEqual(got, manohla);
            });
    });

    it('GET returns 404 for non-existent id', () => {
        const nonId = '597e9d4a119656c01e87d37e';
        return request.get(`/${nonId}`)
            .then(
                () => { throw new Error('expected 404'); },
                res => {
                    assert.equal(res.status, 404);
                }
            );
    });

    it('returns list of all reviewers', () => {
        return Promise.all([
            saveReviewer(david),
            saveReviewer(jeffrey)
        ])
            .then(savedReviewers => {
                david = savedReviewers[0];
                jeffrey = savedReviewers[1];
            })
            .then(() => request.get('/reviewers'))
            .then(res => res.body)
            .then(reviewers => {
                assert.equal(reviewers.length, 3);
                assert.deepInclude(reviewers, manohla);
                assert.deepInclude(reviewers, david);
                assert.deepInclude(reviewers, jeffrey);
            });
    });

    it('updates reviewer', () => {
        manohla.company = 'The NY Times';
        return request.put(`/reviewers/${manohla._id}`)
            .send(manohla)
            .then(res => res.body)
            .then(updated => {
                assert.equal(updated.company, 'The NY Times');
            });
    });

    it('deletes a reviewer', () => {
        return request.delete(`/reviewers/${jeffrey._id}`)
            .then(res => res.body)
            .then(result => {
                assert.isTrue(result.removed);
            })
            .then(() => request.get('/reviewers'))
            .then(res => res.body)
            .then(reviewers => {
                assert.equal(reviewers.length, 2);
            });

    });

    it('delete a non-existent reviewer is removed false', () => {
        return request.delete(`/reviewers/${jeffrey._id}`)
            .then(res => res.body)
            .then(result => {
                assert.isFalse(result.removed);
            });
    });

    it('errors on validation failure', () => {
        return saveReviewer({})
            .then(
                () => { throw new Error('expected failure'); },
                () => { }
            );
    });

});
