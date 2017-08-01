const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;

describe('films route', () => {
    before(db.drop);

    it('initial GET returns empty list', () => {
        return request.get('/films')
            .then(req => {
                const films = req.body;
                assert.deepEqual(films, []);
            });
    });

    // Create Films, maybe also create studios and actors

    // Studios
    let disney = {
        name: 'Disney',
        city: 'Orlando',
        state: 'Florida',
        country: 'USA'
    };

    let universal = {
        name: 'Universal Studios',
        city: 'Los Angeles',
        state: 'California',
        country: 'USA'
    };

    // Actors
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

    // Films
    let savingPrivateRyan = {
        title: 'Saving Private Ryan',
        studio: universal._id,
        released: 2003,
        cast: [tom._id, adam._id]
    };

    let incredibles = {
        title: 'The Incredibles',
        studio: disney._id,
        released: 2004,
        cast: [adam._id, marilyn._id]
    };

    let hulk = {
        title: 'The Incredible Hulk',
        studio: disney._id,
        released: 1987,
        cast: [tom._id, marilyn._id]
    };

    function saveActor(actor) {
        return request
            .post('/actors')
            .send(actor)
            .then(res => res.body);
    }


    function saveStudio(studio) {
        return request
            .post('/studios')
            .send(studio)
            .then(res => {
                studio._id = res.body._id;
                return res.body;
            });
    }

    before(() => {
        return Promise.all([
            saveActor(tom),
            saveActor(adam),
            saveActor(marilyn),
            saveStudio(disney),
            saveStudio(universal)
        ]);
    });

    function saveFilm(film, studio=disney){
        film.studio = studio._id;
        return request
            .post('/films')
            .send(film)
            .then(res => res.body);
    }

    it('roundtrips a new film', () => {
        return saveFilm(savingPrivateRyan, universal)
            .then(saved => {
                assert.ok(saved._id, 'saved has id');
                savingPrivateRyan = saved;
                console.log(saved);
            })
            .then(() => {
                return request.get(`/films/${savingPrivateRyan._id}`);
            })
            .then(res => res.body)
            .then(got => {
                assert.deepEqual(got, savingPrivateRyan);
            });
    });

    it('GET returns a 404 for nonexistent id', () => {
        const nonId = '589d04a8b6695bbdfd3106f1';
        return request.get(`/films/${nonId}`)
            .then(
                () => {throw new Error('expected 404');},
                res => {
                    assert.equal(res.status, 404);
                }
            );
    });

    it('returns list of all films', () => {
        return Promise.all([
            saveFilm(incredibles),
            saveFilm(hulk)
        ])
            .then(savedFilms => {
                incredibles = savedFilms[1];
                hulk = savedFilms[2];
            })
            .then(() => request.get('/films'))
            .then(res => res.body)
            .then();
    });

    it('updates film', () => {
        savingPrivateRyan.released = 2087;
        return request.put(`/films/${savingPrivateRyan._id}`)
            .send(savingPrivateRyan)
            .then(res => res.body)
            .then(updated => {
                assert.equal(updated.released, savingPrivateRyan.released);
            });
    });

    it('deletes a film', () => {
        return request.delete(`/films/${savingPrivateRyan._id}`)
            .then(res => res.body)
            .then(result => {
                assert.isTrue(result.removed);
            });
    });

    it('deletes a non existent film is removed false', () => {
        return request.delete(`/films/${savingPrivateRyan._id}`)
            .then(res => res.body)
            .then(result => {
                assert.isFalse(result.removed);
            });
    });

    it('errors on validation failure', () => {
        return saveFilm({})
            .then(
                () => { throw new Error('unexpected failure'); },
                (errors) => {
                    assert.equal(errors.status, 400);
                }
            );
    });

});