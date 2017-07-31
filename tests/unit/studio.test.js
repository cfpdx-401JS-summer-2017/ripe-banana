const { assert } = require('chai');
const Studio = require('../../lib/models/studio');

describe('Studio model unit tests', () => {
    it('validates required fields for studio model', () => {
        const studio = new Studio({
            name: 'Sarah Joy Studios',
            address: {
                city: 'Ocean City',
                state: 'Maryland',
                country: 'USA'
            }
        });
        return studio.validate();
    });
    
    it('fails validation when required fields are missing', () => {
        const studio = new Studio();

        return studio.validate()
            .then(
                () => {throw new Error('Expected validation error');},
                ({ errors }) => {
                    assert.equal(errors.name.kind, 'required');
                    assert.ok(errors.name);
                }
            );
    });
});