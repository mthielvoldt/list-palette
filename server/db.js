
const { Pool, Client } = require("pg");

const dbConfig = {
    user: process.env.LP_USER,
    password: process.env.LP_PASS,
    database: process.env.LP_DATABASE,
    host: process.env.LP_HOST,
    port: process.env.LP_PORT,
    max: 5,
    idleTimeoutMillis: 4000,
};

const pool = new Pool(dbConfig);
pool.on('error', function (err) {
    console.error('Unexpected error on idle client', err.message, err.stack);
    process.exit(-1);
});

function sendQuery(queryString, params, cb) {
    return pool.query(queryString, params, cb);
}

module.exports = {
    query: sendQuery
}