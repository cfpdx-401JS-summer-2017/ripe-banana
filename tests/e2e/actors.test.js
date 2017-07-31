const chai = require('chai');
const assert = chai.assert;
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

process.env.MONGODB_URI = 'mongodb://localhost:27017/actors-test';

require('../../lib/connect');

const connection = require('mongoose').connection;

const app = require('../../lib/app');
const request = chai.request(app);


describe('actors REST api', () => {

    before(() => connection.dropDatabase());

    // let film = null;

    let amyPoehler = {
        name: 'Amy Poehler',
        dob: new Date(1971, 9, 16),
        pob: 'Newton'
    };

    let willSmith = {
        name: 'Will Smith',
        dob: new Date(1968, 9, 25),
        pob: 'Philadelphia'
    };

    let bryanCranston = {
        name: 'Bryan Cranston',
        dob: new Date(1956, 3, 7),
        pob: 'Los Angeles'
    };

    function saveActor(actor) {
        // actor.film = film._id;
        return request.post('/actors')
            .send(actor)
            .then(({ body }) => {
                actor._id = body._id;
                actor.__v = body.__v;
                return body;
            });
    }

    it('saves an actor', () => {
        return saveActor(amyPoehler)
            .then(savedActor => {
                console.log('savedActor is', savedActor);
                assert.ok(savedActor._id);
                assert.deepEqual(savedActor.name, amyPoehler.name);
            });
    });

    it.skip('gets an actor if they exist', () => {
        return request
            .get(`/actors/${amyPoehler._id}`)
            .then(res => res.body)
            .then(actor => {
                console.log('actor is', actor);
                assert.deepEqual(actor, amyPoehler);
            });
    });

    it('returns 404 if actor does not exist', () => {
        return request
            .get('/actors/657483838485868788909878')
            .then(() => {
                throw new Error('successful status code not expected');
            },
            ({ response }) => {
                assert.ok(response.notFound);
            });
    });

    it('gets ALL the actors', () => {
        return Promise.all([
            saveActor(willSmith),
            saveActor(bryanCranston)
        ])
            .then(() => request.get('/actors'))
            .then(res => {
                const actors = [res.body[0].name, res.body[1].name, res.body[2].name];
                assert.deepEqual(actors, [amyPoehler.name, willSmith.name, bryanCranston.name]);
            });
    });

    it('deletes an actor by its id', () => {
        return request.delete(`/actors/${willSmith._id}`)
            .then(res => {
                const message = JSON.parse(res.text);
                assert.deepEqual(message, {removed: true});
            });
    });
});