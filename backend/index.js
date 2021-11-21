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
  try{
    pool.query(dbfunc.deleteTitle(2));
    const response = await pool.query(dbfunc.insertTitle(2, 3, 4, 5, false, 7, 8, 9, [34, 3, 4]));
    await pool.query(dbfunc.updateTitle(2, 4, 21312, 5, false, 7, 8, 9, [43, 3, 4]));
    res.json(response);
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