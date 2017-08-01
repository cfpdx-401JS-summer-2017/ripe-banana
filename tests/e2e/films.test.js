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
    });
    let actor = null;
    before(()=>{
        return request.post('/actors')
            .send({name: 'Sam Neill'})
            .then(res => res.body)
            .then(savedActor => actor = savedActor);
    });

    let jurassP = {
        title: 'jurassic park',
        released: new Date('11 June 1993'),
    }; 
    let jaw = {
        title: 'jaws',
        released: new Date('June 20, 1975')
    };
    let et = {
        title: 'E.T.',
        released: new Date('May 26, 1982')
    };
    let bruAlm = {
        title: 'Bruce Almighty',
        released: new Date('May 23, 2003')
    };
    let bru = {
        title: 'bruse Almity',
        released: new Date('July 23, 2011')
    };

    function saveFilm(film) {
        film.actor = actor._id;
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
    it('returns 404 if film does not exist', () => {
        return request.get('/films/58ff9f496aafd447254c2666').then(
            () => {
                //resolve
                throw new Error('successful status code not expected');
            },
            ({ response }) => {
                //reject
                assert.ok(response.notFound);
                assert.isOk(response.error);
            }
        );
    });
    it('GET all films', () => {
        return Promise.all([
            saveFilm(jaw),
            saveFilm(et)
        ])
            .then(() => request.get('/films'))
            .then(res => {
                const films = res.body;
                const tstfilms = [jurassP, jaw, et];
                for(let i = 0; i > films.length; i++) {
                    assert.equal(films[i].released,tstfilms[i].released.toISOString());
                    assert.equal(films[i].title,tstfilms[i].title);
                    assert.equal(films[i]._id,tstfilms[i]._id);
                    assert.isOk(films[i].studio);
                }

            });
    });
    // actors needs to be added for test to be complete
    it('rewrites film data by id', () =>{
        return saveFilm(bru)
            .then((saved)=> {
                return request
                    .put(`/films/${saved._id}`)
                    .send(bruAlm);
            })
            .then(res => {
                assert.isOk(res.body._id);
                assert.equal(res.body.title,bruAlm.title);
                assert.equal(res.body.released,bruAlm.released.toISOString());
            });
    });
    it('deletes film by id', () => {
        return request.delete(`/films/${jurassP._id}`)
            .then(res => {
                assert.deepEqual(JSON.parse(res.text), {removed: true});
            });
    });
    it('deletes film by id', () => {
        return request.delete(`/films/${jurassP._id}`)
            .then(res => {
                assert.deepEqual(JSON.parse(res.text), {removed: false});
            });
    });

});