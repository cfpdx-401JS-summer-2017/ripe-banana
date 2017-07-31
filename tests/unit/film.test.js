const { assert } = require('chai');
const Film = require('../../lib/models/film');
const Actor = require('../../lib/models/actor');
const Studio = require('../../lib/models/studio');

describe('Film model unit tests', () => {
    const actorOne = new Actor({ name: 'Tina Fey' });
    const actorTwo = new Actor({ name: 'Brad Pitt' });
    const actorThree = new Actor({ name: 'Amy Poehler' });
    const studio = new Studio({ name: 'Sarah Joy Studios' });

    it('validates with required fields', () => {
        const film = new Film({
            title: 'Mean Girls',
            studio: studio._id,
            released: 2004,
            cast: [
                { role: 'Miss Norbury', actor: actorOne._id },
                { role: 'Cady Heron', actor: actorTwo._id },
                { role: 'Regina George', actor: actorThree._id }
            ]
        });
        return film.validate();
    });

    it('fails validation', () => {
        const film = new Film();
        return film.validate()
            .then(() => { throw new Error('expected validation error'); },
                ({ errors }) => {
                //TODO: Cast array property 
                    assert.ok(errors.title.kind);
                    assert.ok(errors.released.kind);
                    assert.ok(errors.studio.kind);
                });
    });

    it('checks if released is a number', () => {
        const film = new Film({
            title: 'Mean Girls',
            studio: studio._id,
            released: 'fake',
            cast: [
                { role: 'Miss Norbury', actor: actorOne._id },
                { role: 'Cady Heron', actor: actorTwo._id },
                { role: 'Regina George', actor: actorThree._id }
            ]
        });
        return film.validate()
            .then(() => { throw new Error('expected validation error');},
                ({ errors }) => {
                    assert.equal(errors.released.kind, 'Number');
                });
    });


});