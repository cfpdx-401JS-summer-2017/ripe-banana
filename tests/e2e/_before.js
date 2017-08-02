const chai = require('chai');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const app = require('../../lib/app');
const request = chai.request(app);

let actor = {
    name: 'meryl',
    dob: '1990, 10, 08',
    pob: 'portland'
};

let studio = {
    name: 'cool studio'
};

let joeReviewer = {
    name: 'joe schmoe',
    company: 'joe company'
};

let film = {
    title: 'batman',
    studio: studio._id,
    released: 2017,
    // cast: [
    //     { role: 'dude', actor: actor._id }
    // ]
};

let revOne = {
    rating: 3,
    reviewer: joeReviewer._id,
    review: 'It was okay. Could have been better. Oh well.',
    film: film._id
};

function saveActor() {

    return request.post('/actors')
        .send(actor)
        .then(({ body }) => {
            actor._id = body._id;
            return body;
        })
        .then(savedActor => actor = savedActor);
}

function saveStudio() {
    return request.post('/studios')
        .send(studio)
        .then(({ body }) => {
            studio._id = body._id;
            film.studio = studio._id;
            return body;
        })
        .then(savedStudio => studio = savedStudio);
}

function saveReviewer(reviewer = joeReviewer) {
    return request.post('/reviewers')
        .send(reviewer)
        .then(({ body }) => {
            reviewer._id = body._id;
            reviewer.__v = body.__v;
            return body;
        })
        .then(savedReviewer => reviewer = savedReviewer);
}

function saveFilm() {
    return request.post('/films')
        .send(film)
        .then(({ body }) => {
            film._id = body._id;
            return body;
        })
        .then(savedFilm => film = savedFilm);
}

function saveReview(review = revOne) {
    return request.post('/reviews')
        .send(review)
        .then(({ body }) => {
            review._id = body._id;
            review.__v = body.__v;
            review.createdAt = body.createdAt;
            review.updatedAt = body.updatedAt;
            return body;
        })
        .then(savedReview => review = savedReview);
}

module.exports = {
    saveActor,
    saveFilm,
    saveReviewer,
    saveStudio,
    saveReview,
    actor,
    studio,
    reviewer: joeReviewer,
    film,
    review: revOne
};