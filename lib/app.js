const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('./error-handler');

app.use(morgan('dev'));
app.use(bodyParser.json());

const actors = require('./routes/actors');
const films = require('./routes/films');
const reviewers = require('./routes/reviewers');
const reviews = require('./routes/reviews');
const studios = require('./routes/studios');

app.use('/actors', actors);
app.use('/films', films);
app.use('/reviewers', reviewers);
app.use('/reviews', reviews);
app.use('/studios', studios);

app.use(errorHandler());

module.exports = app;