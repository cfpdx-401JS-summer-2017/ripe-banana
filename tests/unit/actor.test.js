const assert = require('chai').assert;
const Actor = require('../../lib/models/actor');

const expectedValidation = () => {throw new Error('expected validation errors');};

describe('Actors model', () => {
    
    it('validates good model', () => {
        const actor = new Actor({
            name: 'Naomi Watts',
            dob: 1968-09-28,
            pob: 'Shoreham, England'
        });
        return actor.validate();
    });

    describe('validation failures', () => {

        it('name is required', () => {
            const actor = new Actor();
            return actor.validate()
                .then(expectedValidation,
                    err => {
                        const errors = err.errors;
                        assert.ok(errors.name && errors.name.kind === 'required');
                    });
        });
    });
});