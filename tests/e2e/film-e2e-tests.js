const app = require("../../lib/app");
const chai = require("chai");
const assert = chai.assert;
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const testData = require("../testdata/films-test-data");
const Film = require("../../lib/models/film-model");
const Studio = require("../../lib/models/studio-model");
const Actor = require("../../lib/models/actor-model");
const Reviewer = require("../../lib/models/reviewer-model");
const Review = require("../../lib/models/review-model");

process.env.MONGODB_URI = "mongodb://localhost:27017/ripe-banana-test";
require("../../lib/connect");
const connection = require("mongoose")
    .connection;
const jsonParser = require("body-parser")
    .json();

// `GET /films` | [{ title, released, studio.name }]
// `GET /films/:id` | { title, released, studio.name, cast: [ { role, actor-name } ], reviews: [rating, review, reviewer.name] }
// POST
// PATCH
// DELETE

describe("film e2e tests", () => {
    const req = chai.request(app);
    before(() => connection);
    beforeEach(() => {
        let testStudio,
            testActor,
            testFilm,
            testFilms,
            testReviewer,
            testReviewA,
            testReviewB,
            testReviews = null;
        connection.dropDatabase();
    });


    const testStudio = new Studio({
        name: "Studio Fantastico",
        address: {
            city: "Krakow",
            state: "",
            country: "Poland"
        }
    });

    const testActor = new Actor({
        name: "Noodly McNoodleface",
        dob: new Date("1987", "11", "11"),
        pob: "Exeter, New Hampshire"
    });

    const testReviewer = new Reviewer({
        name: "Mr. Crankypants",
        company: "New York Times"
    });

    const testFilm = new Film({
        title: "The Greatest Film Ever",
        studio: testStudio._id,
        released: 1997,
        cast: {
            role: "Mayor of Mystery",
            actor: testActor._id
        }
    });

    const testReviewA = {
        rating: 5,
        reviewer: testReviewer._id,
        review: "This may be the best film I have ever seen in my life.",
        film: testFilm._id
    };

    const testReviewB = {
        rating: 0,
        reviewer: testReviewer._id,
        review: "I laughed, I cried, it became a part of me.",
        film: testFilm._id
    };

    const testReviews = [{
            review: testReviewA._id

        },
        {
            review: testReviewB._id
        }
    ];

    const testFilms = [{
            title: "The Greatest Film Ever",
            studio: testStudio._id,
            released: 1997,
            cast: {
                role: "Mayor of Mystery",
                actor: testActor._id
            }
        },
        {
            title: "The Second Greatest Film Ever",
            studio: testStudio._id,
            released: 1997,
            cast: {
                role: "Mayor of Mystery",
                actor: testActor._id
            }
        },
        {
            title: "The Third Greatest Film Ever",
            studio: testStudio._id,
            released: 1997,
            cast: {
                role: "Mayor of Mystery",
                actor: testActor._id
            }
        }
    ];


    function save(testFilm) {
        console.log("2: ", testFilm);
        return req.post("/films")
            .send(testFilm)
            .then(({ body }) => {
                console.log("3: ", body);
                testFilm.__v = body.__v;
                testFilm._id = body._id;
                testFilm.cast = body.cast;
                testFilm.studio = body.studio;
                return testFilm;
            });
    }

    it.only("POST /film", () => {

        console.log('1: ', testFilm);
        return save(testFilm)
            .then(savedFilm => {
                console.log("4: ", savedFilm);
                assert.equal(testFilm.released, savedFilm.released);
                assert.deepEqual(testFilm, savedFilm);
            });
    }), it("GET /films", () => {
        return Promise.all(testData.testFilms.map(save))
            .then(saved => {
                testFilms = saved;
                return req.get("/films")
                    .then(films => {
                        assert.equal(3, films.body.length);
                        assert.deepEqual(films.body, testFilms);
                    });
            });
    }), it("GET /films by id", () => {
        let filmId = null;
        return save(testFilm)
            .then(savedFilm => {
                filmId = "_" + savedFilm._id;
                return req.get("/films")
                    .query({ id: filmId })
                    .then(res => {
                        assert.equal(res.body[0]._id, savedFilm._id);
                    });
            });
    }), it.skip(
        "POST /films",
        () => {}
    ), it.skip("DELETE /films", () => {}), it.skip("PATCH /films", () => {});
});