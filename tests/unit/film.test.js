const assert = require('chai').assert;
const Film = require('../../lib/models/film');
const Studio = require('../../lib/models/studio');
const Actor = require('../../lib/models/actor');

const expectedValidation = () => {throw new Error('expected validation errors');};

describe('Film model', () => {

    it('validates good model', () => {
        const studio = new Studio({name: 'Universal Studios'});
        const actor1 = new Actor({name:'Naomi Watts'});
        const actor2 = new Actor({name:'Laura Elena Harring'});
        const film = new Film ({
            title: 'Mulholland Drive',
            studio: studio._id,
            released: 2001,
            cast: [{
                role: 'Betty Elms',
                actor: actor1._id
            }, {
                role: 'Rita',
                actor: actor2._id
            }]
        });
        return film.validate();
    });

    describe('validation failures', () => {

        it('title, studio, release, cast are all required', () => {
            const film = new Film();
            return film.validate()
                .then(expectedValidation,
                    err => {
                        const errors = err.errors;
                        assert.ok(errors.title && errors.title.kind === 'required');
                        assert.ok(errors.studio && errors.studio.kind === 'required');
                        assert.ok(errors.released && errors.released.kind === 'required');
                    });
        });
    });
});