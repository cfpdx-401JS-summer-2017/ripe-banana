const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

process.envMONGODB_URI = 'mongodb://localhost:27017/ripe-banana-test';

require('../../lib/connect');

const connection = require('mongoose').connection;

const app = require('../../lib/app');

const request = chai.request(app);

describe('actors REST api',() => {
    before(() => connection.dropDatabase());
    let film = null;
    let intStel = {
        title: 'Interstellar',
        released: 'November 5, 2014'
    };
    before(()=>{
        return request.post('/film')
            .send(intStel)
            .then(res => res.body)
            .then(savedFilm => film = savedFilm);
    });
    const peterD = {
        name: 'Peter Dinklage',
        dob: new Date('June 11, 1969')
    };
    const harrsF = {
        name: 'Harrison Ford',
        dob: new Date('July 13, 1942')
    };
    const matthMc = {
        name: 'Matthew McConaughey',
        dob: new Date('November 4, 1969'),
        pob: ' Uvalde, Texas, USA'
    };
    const zoe = {
        name: 'zoeh'
    };
    const zoeS = {
        name: 'Zoe Saldana',
        dob: new Date('June 19, 1978'),
        pob: ' Passaic, New Jersey, USA'

    };
    function saveActor(actor) {
        return request.post('/actors')
            .send(actor)
            .then(({body}) => {
                actor._id = body._id;
                actor.__v = body.__v;
                return body;
            });
    }
    it('saves a actor', () => {
        return saveActor(matthMc)
            .then(savedActor => {
                assert.isOk(savedActor._id);
                assert.equal(savedActor.name, matthMc.name);
                assert.deepEqual(savedActor.dob, matthMc.dob.toISOString());
            });
    });
    it('GETs actor if it exists', () => {
        return request
            .get(`/actors/${matthMc._id}`)
            .then(res => res.body)
            .then(actor => {
                console.log('actor =====>',actor);
                assert.equal(actor.name, matthMc.name);
                assert.equal(actor.dob, matthMc.dob.toISOString());
                assert.equal(actor.pob, matthMc.pob);
                //assert.isOk(actor.films); 
                //an extra test that needs to be added once films are added
            });
    });
    it('returns 404 if actor does not exist', () => {
        return request.get('/actors/58ff9f496aafd447254c2666').then(
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
    it('GET all actors', () => {
        return Promise.all([
            saveActor(harrsF),
            saveActor(peterD),
        ])
            .then(() => request.get('/actors'))
            .then(res => {
                const actors = res.body;
                const tstactors = [matthMc, harrsF, peterD];
                //console.log('actors[0].dob=>',actors[0]._id);
                //console.log('matthMc.dob=>',matthMc._id);
                // console.log('actors =>',actors);
                for(let i = 0; i > actors.length; i++) {
                    assert.equal(actors[i].dob,tstactors[i].dob.toISOString());
                    assert.equal(actors[i].name,tstactors[i].name);
                    assert.equal(actors[i].pob,tstactors[i].pob);
                    assert.equal(actors[i]._id,tstactors[i]._id);
                }

            });
    });
    saveActor(zoe);
    it('rewrites actor data by id', () =>{
        return request
            .put(`/actors/${zoe._id}`)
            .send(zoeS)
            .then(res => {
                assert.isOk(res.body._id);
                assert.equal(res.body.name,zoeS.name);
                assert.equal(res.body.dob,zoeS.dob.toISOString());
            });
    });
    // the deletion tests are passing but still need deletion blocking when actors
    // have films they were in I chose Peter Dinklage as the test subject object 
    //so be sure to remove a film with Peter Dinklage first
    it('deletes actor by id', () => {
        return request.delete(`/actors/${peterD._id}`)
            .then(res => {
                assert.deepEqual(JSON.parse(res.text), {removed: true});
            });
    });
    it('deletes actor by id', () => {
        return request.delete(`/actors/${peterD._id}`)
            .then(res => {
                assert.deepEqual(JSON.parse(res.text), {removed: false});
            });
    });
});