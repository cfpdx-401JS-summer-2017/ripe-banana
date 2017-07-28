const assert = require('chai').assert;
const Studio = require('../../lib/models/studio');

const expectedValidation = () => {throw new Error('expected validation errors');};

describe('Studio models', () => {

    it('validates good model', () => {
        const studio = new Studio({
            name: 'Universal Pictures',
            address: {
                city: 'Los Angeles',
                state: 'California',
                country: 'USA'
            }
        });
        return studio.validate();
    });

    describe('validation failures', () => {

        it('name is required', () => {
            const studio = new Studio();
            return studio.validate()
                .then(expectedValidation,
                    err => {
                        const errors = err.errors;
                        assert.ok(errors.name && errors.name.kind === 'required');
                    });
        });
    });
});