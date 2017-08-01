// const db = require('./_db');
// const request = require('./_request');
// const assert = require('chai').assert;

// describe('reviews route', () => {
//     before(db.drop);

//     let reviewer = null;
//     let actor1 = null;
//     let actor2 = null;
//     let film = null;

//     before(() => {
//         let rogerEbert = {
//             name: 'Roger Ebert',
//             company: 'Chicago Sun Times'
//         };
//         return request.post('/reviewers')
//             .send(rogerEbert)
//             .then(res => res.body)
//             .then(savedReviewer => reviewer = savedReviewer);
//     });

//     before(() => {
//         let naomiWatts = {
//             name: 'Naomi Watts',
//             dob: 1968-09-28,
//             pob: 'Shoreham, England'
//         };

//         return request.post('/actors')
//             .send(naomiWatts)
//             .then(res => res.body)
//             .then(savedActor => actor1 = savedActor);
//     });
    
//     before(() => {
//         let lauraElenaHarring = {
//             name: 'Laura Elena Harring',
//             dob: 1964-03-03,
//             pob: 'Los Mochis, Mexico'
//         };

//         return request.post('/actors')
//             .send(lauraElenaHarring)
//             .then(res => res.body)
//             .then(savedActor => actor2 = savedActor);
//     });

//     before(() => {
//         let mulhollandDrive = {
//             title: 'Mulholland Drive',
//             studio: 'Universal Pictures',
//             released: 2001,
//             cast: [
//                 actor1._id,
//                 actor2._id
//             ]
//         };

//         return request.post('/films')
//             .send(mulhollandDrive)
//             .then(res => res.body)
//             .then(savedFilm => film = savedFilm);
//     });

//     it('initial GET returns empty list', () => {
//         return request.get('/reviews')
//             .then(req => {
//                 const reviews = req.body;
//                 assert.deepEqual(reviews, []);
//             });
//     });
    
//     let mulhollandDriveReview = {
//         rating: 5,
//         reviewer: reviewer._id,
//         content: 'David Lynch has been working toward Mulholland Drive all of his career, and now that he’s arrived there I forgive him Wild at Heart and...',
//         film: film._id
//     };
    
//     function saveReview(review) {
//         return request
//             .post('/reviews')
//             .send(review)
//             .then(res => res.body);
//     }

//     it('roundtrips a new review', () => {
//         return saveReview(mulhollandDriveReview)
//             .then(saved => {
//                 assert.ok(saved._id, 'saved has id');
//                 mulhollandDriveReview = saved;
//             })
//             .then(() => {
//                 return request.get(`/reviews/${mulhollandDriveReview._id}`);
//             })
//             .then(res => res.body)
//             .then(got => {
//                 assert.deepEqual(got, mulhollandDriveReview);
//             });
//     });

//     after(db.drop);
// });