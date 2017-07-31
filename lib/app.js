const express = require('express');
const app = express();
const morgan = require('morgan');
const errorHandler = require('./error-handler')();

app.use(morgan('dev'));
app.use(express.static('public'));

const actors = require('./routes/actors');
const films = require('./routes/films');
const studios = require('./routes/studios');
// const reviewer = require('./routes/reviewer');
// const review = require('./routes/review');


app.use('/actors', actors);
app.use('/films', films);
app.use('/studios', studios);
// app.use('/studios', studios);
// app.use('/reviewer', reviewer);
// app.use('/review', review);

app.use(errorHandler);

module.exports = app;