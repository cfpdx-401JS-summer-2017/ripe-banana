const Film = require('../../lib/models/film');
const Studio = require('../../lib/models/studio');
const {assert} = require('chai');
describe('Film model',() => {
    it('validates with requierd fields', () => {
        const studio = new Studio({
            name: 'Universal Studios',

        });
        const film = new Film({
            title: 'jurassic park',
            released: new Date('11 June 1993'),
            studio: studio._id
        });
        return film.validate();
    });
    it('fails validation when required fields are missing', () => {
        const film = new Film();

        return film.validate()
            .then( () => {
                throw new Error('Expected Validation error');
            }, ({errors}) =>{
                assert.ok(errors.title);
            });
    });
    //it('has valid studio name attached')
});