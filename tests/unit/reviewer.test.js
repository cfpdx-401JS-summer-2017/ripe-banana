const { assert } = require('chai');
const Reviewer = require('../../lib/models/reviewer');

describe('Reviewer Model unit tests', () => {
    it('validates reviewer model required fields', () => {
        const reviewer = new Reviewer({
            name: 'Meryl Turner',
            company: 'Reviewed By Meryl'
        });
        return reviewer.validate();
    });

    it('fails validation when required fields are missing', () => {
        const reviewer = new Reviewer();

        return reviewer.validate()
            .then(
                () => {throw new Error('Expected validation error');},
                ({ errors }) => {
                    assert.equal(errors.name.kind, 'required');
                    assert.equal(errors.company.kind, 'required');
                    assert.ok(errors.company && errors.name);
                }
            );
    });
});