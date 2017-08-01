// const Actor = require('../../lib/models/actor');
// const Studio = require('../../lib/models/studio');
// const Film = require('../../lib/models/film');
// const Review = require('../../lib/models/review');
// const Reviewer = require('../../lib/models/reviewer');

// let amyPoehler = {
//     name: 'Amy Poehler',
//     dob: new Date(1971, 9, 16),
//     pob: 'Newton'
// };

// let willSmith = {
//     name: 'Will Smith',
//     dob: new Date(1968, 9, 25),
//     pob: 'Philadelphia'
// };

// let bryanCranston = {
//     name: 'Bryan Cranston',
//     dob: new Date(1956, 3, 7),
//     pob: 'Los Angeles'
// };

// let film = null;
// before(() => {
//     return request.post('/films')
//         .send(
//         { title: 'Mean Girls' },
//         { studio: '123456789012345678901234' },
//         { released: 2001 },
//         {
//             cast: [
//                 { role: 'Wonder Woman', actor: '857465768885558399423345' },
//                 { role: 'Steve Trevor', actor: '857465768885558399423345' },
//                 { role: 'Antiope', actor: '857465768885558399423345' }
//             ]
//         }
//         )
//         .then(res => res.body)
//         .then(savedFilm => {
//             console.log('saved film is', savedFilm);
//             film = savedFilm;
//         });
// });

