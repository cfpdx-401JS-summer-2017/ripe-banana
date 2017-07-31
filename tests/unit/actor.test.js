const { assert } = require('chai');
const Actor = require('../../lib/models/actor');

describe('Actor model unit tests', () => {
    it('validates the actor model', () => {
        const actor = new Actor({
            name: 'Pauly Short',
            dob: new Date(1970, 3, 1),
            pob: 'New York City'
        });
        return actor.validate();
    });

    it('fails validation when required fields are missing', () => {
        const actor = new Actor();

        return actor.validate()
            .then(
                () => {throw new Error('Expected validation error');},
                ({ errors }) => assert.ok(errors.name.kind)
            );
    });

    it('should be type date', () => {
        const actor = new Actor({
            name: 'Pauly Short',
            dob: 'date date',
            pob: 'New York City'
        });

        return actor.validate()
            .then(
                () => {throw new Error('Expected to be of type date');},
                ({ errors }) => assert.equal(errors['dob'].kind, 'Date')
            );
    });









});