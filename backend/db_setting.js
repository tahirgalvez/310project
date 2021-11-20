console.log("dbrgra.js running");

const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "password",
    database: "csce310project",
    host: "localhost",
    port: "5432"
});

module.exports = pool;
