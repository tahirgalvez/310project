// server/index.js
const express = require("express");
const path = require('path');
const PORT = 3001;
const app = express();

const pool = require("./db");

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get("/titles", async (req, res) => {
  try{
    const response = await pool.query("SELECT * FROM title");
    res.json(response.rows);
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