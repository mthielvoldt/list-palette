const bcrypt = require("bcrypt");

const saltRounds = 10;

function compare(plainText, hash, cb) {
    return bcrypt.compare(plainText, hash, cb);     // callback version

}

function hash(plainText) {
    return bcrypt.hash(plainText, saltRounds);  // returns a promise
}

module.exports = {
    compare: compare,
    hash: hash
}