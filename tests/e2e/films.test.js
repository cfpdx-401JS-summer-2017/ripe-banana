const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

process.envMONGODB_URI = 'mongodb://localhost:27017/ripe-banana-test';

require('../../lib/connect');

const connection = require('mongoose').connection;

const app = require('../../lib/app');

const request = chai.request(app);

describe('films REST api', () => {
    before(() => connection.dropDatabase());

    let studio = null;
    before(() => {
        return request.post('/studios')
            .send({name: 'universal studios'})
            .then(res => res.body)
            .then(savedStudio => studio = savedStudio);
    })

    let jurassP = {
        title: 'jurassic park',
        released: new Date('11 June 1993'),
    }; 

    function saveFilm(film) {
        film.studio = studio._id;
        return request
            .post('/films')
            .send(film)
            .then(res => res.body);
    }
    
    it('roundtrips a new film', () => {
        return saveFilm(jurassP)
            .then(saved => {
                assert.ok(saved._id, 'saved has ID');
                jurassP = saved;
            })
            .then(() => {
                return request.get(`/films/${jurassP._id}`);
            })
            .then(res => res.body)
            .then(got => {
                assert.deepEqual(got, jurassP);
            });
    });

});