const db = require('./_db');
const chai = require('chai');
const request = require('./_request');
const { assert } = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('studios REST api', () => {
    before(db.drop);

    const warner = {
        name: 'Warner Bros Studios',
        address: {
            city: 'Los Angeles',
            state: 'California',
            country: 'USA'
        }
    };

    const fox = {
        name: 'Fox Studios',
        address: {
            city: 'New York',
            state: 'Maryland',
            country: 'USA'
        }
    }
    const universal = {
        name: 'Universal Studios',
        address: {
            city: 'Detroit',
            state: 'Georgia',
            country: 'USA'
        }
    }

    function saveStudio(studio) {
        return request.post('/studios')
            .send(studio)
            .then(({ body }) => {
                studio._id = body._id;
                studio._v = body._v;
                studio.name = body.name;
                return body
            });
    }
    it('saves a studio', () => {
        return saveStudio(warner)
            .then(savedStudio => {
                assert.ok(savedStudio._id);
                assert.isOk(savedStudio.name)
                assert.deepEqual(savedStudio.name, warner.name);
                assert.deepEqual(savedStudio.address, warner.address);
            });
    });

    it('GETs a studio if it exists', () => {
        return request.get(`/studios/${warner._id}`)
            .then(res => res.body)
            .then(studio => {
                assert.deepEqual(studio.name, warner.name);
                assert.deepEqual(studio.address, warner.address);
            });
    });

    it('returns 404 if a studio does not exist', () => {
        return request.get('/studios/58ff9f496aafd447111c29b5')
            .then(
            () => {
                throw new Error('Unexpected Success In Error Test');
            },
            res => {
                assert.equal(res.status, 404);
                assert.equal(res.message, 'Not Found');
            }
            );
    });

    it('GET all Studios', () => {
        return Promise.all([
            saveStudio(fox),
            saveStudio(universal),
        ])
            .then(() => request.get('/studios'))
            .then(res => {
                const studios = res.body;
                assert.equal(studios[2].name, universal.name);
                assert.equal(studios[1].name, fox.name);
            });
    });

    it('Replaces studio content', () => {
        const marvel = {
            name: 'Marvel Studios',
            address: {
                city: 'Portland',
                state: 'Oregon',
                country: 'USA'
            }
        };

        return request
            .put(`/studios/${warner._id}`)
            .send(marvel)
            .then(res => res.body)
            .then(studio => {
                assert.deepEqual(studio.name, marvel.name);
                assert.deepEqual(studio.address, marvel.address);
            });
    });

    it('deletes an studio by id', () => {
        return request
            .delete(`/studios/${warner._id}`)
            .then(res => {
                assert.deepEqual(JSON.parse(res.text), { removed: true });
            });
    });
});