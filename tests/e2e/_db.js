process.env.MONGODB_URI = 'mongodb://localhost:27017/soggyPickle-test';
require('../../lib/connect');
const connection = require('mongoose').connection;

module.exports = {
    drop() {
        return connection.dropDatabase();
    }
};