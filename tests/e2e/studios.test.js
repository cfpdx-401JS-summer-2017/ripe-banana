const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe('studios model', () => {

    before(db.drop);

    let studio = null;
    before(() => {
        return request.post('/studios')
            .send({ name: 'Pixar', addres: { city: 'Emeryville', state: 'CA', country: 'USA' } })
            .then(res => res.body)
            .then(savedStudio => studio = savedStudio);
    });

    let disney = {
        name: 'Disney',
        address: {
            city: 'Anahiem',
            state: 'CA',
            country: 'USA'
        }
    };

    let warnerbrothers = {
        name: 'Warner Brothers',
        address: {
            city: 'Los Angeles',
            state: 'CA',
            country: 'USA'
        }
    };

    let universal = {
        name: 'Universal Studios',
        address: {
            city: 'Universal City',
            state: 'CA',
            country: 'USA'
        }
    };

    function saveStudio(studio) {
        return request
            .post('/studios')
            .send(studio)
            .then(res => res.body);
    }

    it('roundtrips a new studio', () => {
        return saveStudio(disney)
            .then(saved => {
                assert.ok(saved._id, 'saved has id');
                disney = saved;
            })
            .then(() => {
                return request.get(`/studios/${disney._id}`);
            })
            .then(res => res.body)
            .then(get => {
                assert.deepEqual(get, disney);
            });
    });

    it('GET returns 404 for non-existent id', () => {
        const nonId = '589d04a8b6695bbdfd3106f1';
        return request.get(`/studios/${nonId}`)
            .then(
                () => { throw new Error('expected 404'); },
                res => {
                    assert.equal(res.status, 404);
                }
            );
    });

    it('returns list of all studios', () => {
        return Promise.all([
            saveStudio(universal),
            saveStudio(warnerbrothers)
        ])
            .then(savedStudios => {
                disney = savedStudios[0];
                warnerbrothers = savedStudios[1];
            })
            .then(() => request.get('/studios'))
            .then(res => res.body)
            .then(studio => {
                assert.isTrue(studio.length>1);
            });
    });

    it('updates studio', () => {
        disney.address.state = 'OR';
        return request.put(`/studios/${disney._id}`)
            .send(disney)
            .then(res => res.body)
            .then(updated => {
                assert.equal(updated.address.state, disney.address.state);           
            });
    });

    it('deletes a studio', () => {
        return request.delete(`/studios/${warnerbrothers._id}`)
            .then(res => res.body)
            .then(result => {
                assert.isTrue(result.removed);
            });
    });

    it('delete a non-existent studio removed false', () => {
        return request.delete(`/studios/${warnerbrothers._id}`)
            .then(res => res.body)
            .then(result => {
                assert.isFalse(result.removed);
            });
    });

    it('errors on validation failure', () => {
        return saveStudio({})
            .then(
                () => { throw new Error('expected failure');},
                () => { }
            );
    });
});

