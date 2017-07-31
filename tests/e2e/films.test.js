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

    // let studio = null;
    // before(() => {
    //     return request.post('/studios')
    //         .send({ name: 'Some Studio' })
    //         .then(res => res.body)
    //         .then(savedStudio => studio = savedStudio);
    // });

    const wonderWoman = {
        title: 'Wonder Woman',
        studio: '857465768885558399423345',
        released: 2017,
        cast: [
            { role: 'Wonder Woman', actor: '857465768885558399423345' },
            { role: 'Steve Trevor', actor: '857465768885558399423345' },
            { role: 'Antiope', actor: '857465768885558399423345' }
        ]
    };

    const spaceBalls = {
        title: 'Space Balls',
        studio: '857465768885558399423345',
        released: 1980,
        cast: [
            { role: 'Yogurt', actor: '857465768885558399423345' },
            { role: 'Dark Helmet', actor: '857465768885558399423345' },
            { role: 'Barf', actor: '857465768885558399423345' }
        ]
    };

    const princessBride = {
        title: 'The Princess Bride',
        studio: '657575758855775645354545',
        released: 1985,
        cast: [
            { role: 'Wesley', actor: '857465768885558399423345' },
            { role: 'Buttercup', actor: '857465768885558399423345' },
            { role: 'Inigo', actor: '857465768885558399423345' }
        ]
    };

    function saveFilm(film) {
        // film.studio = studio._id;
        return request.post('/films')
            .send(film)
            .then(({ body }) => {
                film._id = body._id;
                film.__v = body.__v;
                film.cast = body.cast;
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
            .then(film => assert.deepEqual(film, wonderWoman));
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
            .then(res => {
                const message = JSON.parse(res.text);
                assert.deepEqual(message, { removed: true });
            });
    });
});