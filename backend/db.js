console.log("db.js running");

const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "password",
    database: "csce310project",
    host: "localhost",
    port: "5432"
});

module.exports = pool;

function getAllTitles() {
    return "SELECT * FROM title";
}


