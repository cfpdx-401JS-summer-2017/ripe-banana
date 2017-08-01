
process.env.MONGODB_URI = 'mongodb://localhost:27017/bananasRSweet-test';
require('../../lib/connect');
const connection = require('mongoose').connection;

module.exports = {
    drop() {
        return connection.dropDatabase();
    }
};