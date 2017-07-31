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
        pob: 'Concord, MA'
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
    
    it('GET returns 404 for non-existent id', () => {
        const nonId = '589d04a8b6695bbdfd3106f1';
        return request.get(`/actors/${nonId}`)
            .then(
                () => { throw new Error('expected 404');},
                res => {
                    assert.equal(res.status, 404);
                }
            );
    });

    it('returns list of all actors', () => {
        return Promise.all([
            saveActor(adam),
            saveActor(marilyn)
        ])
            .then(savedActors => {
                adam = savedActors[0];
                marilyn = savedActors[1];
            })
            .then(() => request.get('/actors'))
            .then(res => res.body)
            .then(actors => {
                assert.equal(actors.length, 3);
                assert.deepEqual(actors[0], tom);
                assert.deepEqual(actors[1], adam);
                assert.deepEqual(actors[2], marilyn);
            });
    });
    
    it ('updates actor', () => {
        tom.pob = 'Concord, CA';
        return request.put(`/actors/${tom._id}`)
            .send(tom)
            .then(res => res.body)
            .then(updated => {
                assert.equal(updated.pob, 'Concord, CA');
            });
    });
    it ('deletes an actor', () => {
        return request.delete(`/actors/${adam._id}`)
            .then(res => res.body)
            .then(result => {
                assert.isTrue(result.removed);
            })
            .then(() => request.get('/actors'))
            .then(res => res.body)
            .then(actors => {
                assert.equal(actors.length, 2);
            });
    });
    it ('delete a non-existent actor is removed false', () => {
        return request.delete(`/actors/${adam._id}`)
            .then(res => res.body)
            .then(result => {
                assert.isFalse(result.removed);
            });
    });
});