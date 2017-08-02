const assert = require('chai').assert;
const Reviewer = require('../../lib/models/reviewer');

const expectedValidation = () => { throw new Error('expected validation errors'); };

describe('Reviewer model', () => {

    it('validates good model', () => {
        const reviewer = new Reviewer({
            name: 'Roger Ebert',
            company: 'Chicago Sun Times'
        });
        return reviewer.validate();
    });

    describe('validation failures', () => {

        it('name and company are required', () => {
            const reviewer = new Reviewer();
            return reviewer.validate()
                .then(expectedValidation,
                    err => {
                        const errors = err.errors;
                        assert.ok(errors.name && errors.name.kind === 'required');
                        assert.ok(errors.company && errors.company.kind === 'required');
                    });
        });
    });
});