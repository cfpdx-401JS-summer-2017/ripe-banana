const express = require('express');
const app = express();
const errorHandler = require('./error-handler');
const morgan = require('morgan');

const studios = require('./routes/studios');
const films = require('./routes/films');
const actors = require('./routes/actors');
const reviews = require('./routes/reviews');
const reviewers = require('./routes/reviewers');

app.use(morgan('dev'));

app.use('/studios', studios);
app.use('/films', films);
app.use('/actors', actors);
app.use('/reviews', reviews);
app.use('/reviewers', reviewers);

app.use(errorHandler);

module.exports = app;