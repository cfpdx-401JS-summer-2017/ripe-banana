const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

process.env.MONGODB_URI = 'mongodb://localhost:27017/ripe-banana-reviewer-test';

require('../../lib/connect');

const connection = require('mongoose').connection;

const app = require('../../lib/app');

const request = chai.request(app);

describe.only('reviewer REST api', () => {

    before (() => connection.dropDatabase());

    const siskel = new Reviewer({
        name: 'Siskel',
        company: 'filmflappers.net'
    });

    const ebert = new Reviewer({
        name: 'Ebert',
        company: 'cinemanima.world'
    });

    function saveReviewer(reviewer) {
        return request.post('/api/reviewers')
            .send(reviewer)
            .then(({ body }) => {
                reviewer._id = body._id;
                reviewer.__v = body.__v;
                return body;
            });
    }

    it('saves a reviewer', () => {
        return saveReviewer(siskel)
            .then( savedReviewer => {
                assert.isOk(savedReviewer._id);
                assert.deepEqual(savedReviewer, siskel);
            });
    });
});