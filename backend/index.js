// server/index.js
const express = require("express");
const path = require('path');
const app = express();
const pool = require("./db_setting");

// Imports query functions to this file.
const dbf = require("./db_functions");
var dbfunc = new dbf;

app.listen(process.env.PORT || 3001 , () => {
  console.log(`Server listening on 3001`);
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get("/titles", async (req, res) => {

  var title = req.query.title;

  var isAdult = req.query.isAdult; if (isAdult === 'null' || isAdult === '') isAdult = null;
  if (isAdult === 'true') {isAdult = true;}
  if (isAdult === 'false') {isAdult = null;}

  var minYear = req.query.minYear; if (minYear === 'null' || minYear === '') minYear = null;
  var maxYear = req.query.maxYear; if (maxYear === 'null' || maxYear === '') maxYear = null;
  var minRunTimeMinutes = req.query.minRunTimeMinutes; if (minRunTimeMinutes === 'null' || minRunTimeMinutes === '') minRunTimeMinutes = null; 
  var maxRunTimeMinutes = req.query.maxRunTimeMinutes; if (maxRunTimeMinutes === 'null' || maxRunTimeMinutes === '') maxRunTimeMinutes = null;
  var minRating = req.query.minRating; if (minRating === 'null' || minRating === '') minRating = null;
  var maxRating = req.query.maxRating; if (maxRating === 'null' || maxRating === '') maxRating = null;
  var genres = req.query.genres.split(','); if (genres.length === 1 && genres[0] === '') genres = null;

  try{
    pool.query(dbfunc.advancedSearchTitle(title, 'movie', isAdult, minYear, maxYear, minRunTimeMinutes, maxRunTimeMinutes, minRating, maxRating, genres, 1, 100, "title.t_const", true), function(err, result, fields) {
      if (err) console.log(err.message);
      res.json(result.rows); // Sends result to browser
      console.log(JSON.stringify(result.rows, null, 2));
    });
  }
  catch (err) {
    console.error(err.message);
  }
});

app.get("/showss", async (req, res) => {

  var title = req.query.title;

  try{
    pool.query(dbfunc.advancedSearchTitle(title,'tvseries', null, null, null, null, null, null, null, null, 1, 100, "title.t_const", true), function(err, result, fields) {
      if (err) console.log(err.message);
      res.json(result.rows); // Sends result to browser
      console.log(JSON.stringify(result.rows, null, 2));
    });
  }
  catch (err) {
    console.error(err.message);
  }
});

app.get("/people", async (req, res) => {

  console.log(req);
  var title = req.query.title;

  try{
    pool.query(dbfunc.advancedSearchPerson(title, null,null,null,null,null,1,50,null,true), function(err, result, fields) {
      if (err) console.log(err.message);
      res.json(result.rows); // Sends result to browser
      console.log(JSON.stringify(result.rows, null, 2));
    });
  }
  catch (err) {
    console.error(err.message);
  }
});

app.get('/shows', (req, res) => res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html')));
app.get('/crewcast', (req, res) => res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html')));
app.get('/movies', (req, res) => res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html')));
// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../frontend/build')));
