console.log("dbrgra.js running");

const Pool = require("pg").Pool;

//daniel's local database
// const pool = new Pool({
//     user: "postgres",
//     password: "password",
//     database: "csce310project",
//     host: "localhost",
//     port: "5432"
// });

//heroku database
const connectionString = 'postgres://oaxmrpctgtjdyk:879d07a71cedbc3f2c4e1720177eb73dce983b73369f8a03aa01d1e84d4fa0e0@ec2-3-230-149-158.compute-1.amazonaws.com:5432/dsie04961744k'
const pool = new Pool({
  connectionString,
})

module.exports = pool;
