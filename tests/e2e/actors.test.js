const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe('actors route', () => {
    before(db.drop);

    it('initial GET returns empty list', () => {
        return request.get('/actors')
            .then(req => {
                const actors = req.body;
                assert.deepEqual(actors, []);
            });
    });

    let tom = {
        name: 'Tom Hanks',
        dob: 1956-07-09,
        pob: 'Concord, CA'
    };

    let adam = {
        name: 'Adam Sandler',
        dob: 1966-09-09,
        pob: 'Brooklyn, NY'
    };

    let marilyn = {
        name: 'Marilyn Monroe',
        dob: 1926-06-01,
        pob: 'Los Angeles, CA'
    };

    function saveActor(actor) {
        return request
            .post('/actors')
            .send(actor)
            .then(res => res.body);
    }

    it('roundtrips a new actor', () => {
        return saveActor(tom)
            .then(saved => {
                assert.ok(saved._id, 'saved has id');
                tom = saved;
            })
            .then(() => {
                return request.get(`/actors/${tom._id}`);
            })
            .then(res => res.body)
            .then(got => {
                assert.deepEqual(got, tom);
            });
    });
});