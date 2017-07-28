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

    before(() => connection.dropDatabase());

    let studio = null;
    before(() => {

        return request.post('/studios')
            .send({ name: 'Universal Studios' })
            .then(res => res.body)
            .then(savedStudio => studio = savedStudio)
            .then(console.log(studio));

    });

});



                // assert.ok(savedStudio._id);
                // assert.equal(savedStudio.name, 'Universal Studios');
                // assert.equal(savedStudio.address.city, 'Hollywood');
                // assert.equal(savedStudio.address.state, 'California');
                // assert.equal(savedStudio.address.zip, 91608);