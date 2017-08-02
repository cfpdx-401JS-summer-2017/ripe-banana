const mongoose = require('mongoose');
mongoose.Promise = Promise;

const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/bananas';

mongoose.connect(dbUrl);

mongoose.connection.on('connected', () => console.log('mongoose default connection open to' + dbUrl));

mongoose.connection.on('error', err => console.log('mongoose default connection error' + err));

mongoose.connection.on('disconnected', () => console.log('mongoose default connection disconnected'));

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});