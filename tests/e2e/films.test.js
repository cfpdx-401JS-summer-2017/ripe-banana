const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

process.env.MONGODB_URI = 'mongodb://localhost:27017/films-test';

require('../../lib/connect');

const connection = require('mongoose').connection;

const app = require('../../lib/app');
const request = chai.request(app);


describe('films REST api', () => {
    before(() => connection.dropDatabase());

    before(() => {
        return saveActor(george)
            .then(savedActor => {
                wonderWoman.cast[0].actor = savedActor._id;
                console.log('george is: ', george._id, 'wonderWoman.cast etc is', wonderWoman.cast[0].actor);
            });
    });

    let studio = null;
    before(() => {
        return request.post('/studios')
            .send({ name: 'Warner Bros Studios' })
            .then(res => res.body)
            .then(savedStudio => studio = savedStudio);
    });

    const revOne = {
        rating: 3,
        reviewer: '123412345567898765466676',
        review: 'It was okay. Could have been better. Oh well.',
        film: '123412345567898765466676',
        createdAt: new Date,
        updatedAt: new Date
    };

    const george = {
        name: 'George Clooney',
        dob: new Date('1980, 4, 1'),
        pob: 'Portland, OR'
    };

    const wonderWoman = {
        title: 'Wonder Woman',
        released: 2017,
        cast: [
            { role: 'Wonder Woman'}
        ]
    };

    const spaceBalls = {
        title: 'Space Balls',
        released: 1980,
        cast: [
            { role: 'Yogurt', actor: '857465768885558399423345' }
        ]
    };

    const princessBride = {
        title: 'The Princess Bride',
        released: 1985,
        cast: [
            { role: 'Wesley', actor: '857465768885558399423345' }
        ]
    };

    function saveFilm(film) {
        film.studio = studio._id;
        return request.post('/films')
            .send(film)
            .then(({ body }) => {
                film._id = body._id;
                film.__v = body.__v;
                film.cast = body.cast;
                return body;
            });
    }

    function saveActor(actor) {
        return request.post('/actors')
            .send(actor)
            .then(({ body }) => {
                actor._id = body._id;
                return body;
            });
    }

    it('saves a film', () => {
        return saveFilm(wonderWoman)
            .then(savedFilm => {
                assert.ok(savedFilm._id);
                assert.deepEqual(savedFilm, wonderWoman);
            });
    });

    xit('GETs a film by id', () => {
        return request.get(`/films/${wonderWoman._id}`)
            .then(res => res.body)
            .then(film => {
                assert.equal(film.title, 'Wonder Woman');
                assert.equal(film.released, wonderWoman.released);
                assert.equal(film.studio.name, 'Warner Bros Studios');
                assert.include(film.cast[0].actor.name, 'Gal Gadot');
            
            });
    });

    it('GETS all films', () => {
        return Promise.all([
            saveFilm(spaceBalls),
            saveFilm(princessBride)
        ])
            .then(res => {
                const films = res.sort((a,b) => {
                    if(a.title < b.title) return 1;
                    else if (a.title >b.title) return -1;
                    else return 0;
                });
                assert.deepEqual(films, [princessBride, spaceBalls]);
            });
    });

    it('deletes a film by id', () => {
        return request.delete(`/films/${spaceBalls._id}`)
            .then(res => assert.deepEqual(res.body, { removed: true })
            );
    });

    it('returns 404 if film not there', () => {
        return request.delete(`/films/${spaceBalls._id}`)
            .then(res => assert.deepEqual(res.body, { removed: false })
            );
    });

    it('updates a film by id', () => {
        return request.patch(`/films/${princessBride._id}`)
            .send({ title: 'Princess Pride' })
            .then(res => assert.equal(res.body.title, 'Princess Pride'));
    });
});