const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

process.env.MONGODB_URI = 'mongodb://localhost:27017/ripe-banana-test';

require('../../lib/connect');

const connection = require('mongoose').connection;

const app = require('../../lib/app');
const request = chai.request(app);

describe('studio REST api', () => {



    it('saves new studio', () => {
        before(() => connection.dropDatabase());

        let studio = null;
        return request.post('/studios')
            .send({ name: 'Universal Studios' })
            .then(res => studio = res.body)
            .then(() => {
                assert.ok(studio._id);
                assert.equal(studio.name, 'Universal Studios');
                // assert.equal(studio.address.city, 'Hollywood');
                // assert.equal(studio.address.state, 'California');
                // assert.equal(studio.address.zip, 91608);
            });
    });
});
