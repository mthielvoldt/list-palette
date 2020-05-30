
const { Pool, Client } = require("pg");

const dbConfig = {
    user: process.env.PGUSER,
    password: process.env.PGPASS,
    database: process.env.PGDATABASE,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
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