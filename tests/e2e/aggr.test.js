const db = require('./_db');
const request = require('./_request');
const assert = require('chai').assert;
const { execSync } = require('child_process');

describe('aggregate model', () => {
    before(db.drop);
    
    before(() => {
        execSync('mongoimport --db soggyPickle-jsonData --collection actors --drop --jsonArray --file actors.json');
        execSync('mongoimport --db soggyPickle-jsonData --collection reviewers --drop --jsonArray --file reviewers.json');
        execSync('mongoimport --db soggyPickle-jsonData --collection studios --drop --jsonArray --file studios.json');
        execSync('mongoimport --db soggyPickle-jsonData --collection films --drop --jsonArray --file films.json');
        execSync('mongoimport --db soggyPickle-jsonData --collection reviews --drop --jsonArray --file reviews.json');
    });

    it('returns list of all films with average rating', () => {
        
    });
});