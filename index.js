const express = require('express');
const app = express();
const fs = require('fs')
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

app.set('view engine', 'ejs');

function sqlPromise(query, params = []) {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
}

app.get(['/', '/home'], async (req, res) => {
  res.render('home');
});

app.get('/leaderboard', async (req, res) => {
  let data = JSON.parse(fs.readFileSync('data.json'));
  easyData = []
  mediumData = []
  hardData = []
  impossibleData = []
  for (i = 0; i < data.length; i++) {
    if (data[i]["difficulty"] === "EASY") {
      easyData.push(data[i])
    } else if (data[i]["difficulty"] === "MEDIUM") {
      mediumData.push(data[i])
    } else if (data[i]["difficulty"] === "HARD") {
      hardData.push(data[i])
    } else if (data[i]["difficulty"] === "IMPOSSIBLE") {
      impossibleData.push(data[i])
    }
  }
  function compareTo(a, b) {
    if (a.points < b.points) {
      return 1;
    } else if (a.points > b.points) {
      return -1;
    } else {
      if (a.time < b.time) {
        return -1;
      } else if (a.time > b.time) {
        return 1;
      } else {
        return 0;
      }
    }
  }
  easyData.sort(compareTo);
  mediumData.sort(compareTo);
  hardData.sort(compareTo);
  impossibleData.sort(compareTo);
  let dictionary_out = { 'data': data, 'easyData': easyData, 'mediumData': mediumData, 'hardData': hardData, 'impossibleData': impossibleData }
  res.render('leaderboard', dictionary_out);
});

app.get('/saveData', async (req, res) => {
  let { username, points, player, time, difficulty } = req.query;
  username = username.replaceAll("\"", "")
  points = points.replaceAll("\"", "")
  player = player.replaceAll("\"", "")
  time = time.replaceAll("\"", "")
  difficulty = difficulty.replaceAll("\"", "")
  points = parseInt(points)
  time = parseFloat(time)
  let data = JSON.parse(fs.readFileSync('data.json'));
  const currentDate = new Date();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const month = months[currentDate.getMonth()];
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();
  const date = `${month} ${day}, ${year}`;
  data.push({ username, points, player, time, difficulty, date });
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
  res.send("DATA SAVED");
});

app.get('/easy', async (req, res) => {
    let { username } = req.query;
    let sqlquery = `SELECT * FROM players`;
    let results = await sqlPromise(sqlquery);
    let number = Math.floor(Math.random() * 60) + 1;
    let dictionary_out = { 'results': results, 'number': number, 'username': username };
    res.render('easy', dictionary_out);
});

app.get('/medium', async (req, res) => {
  let { username } = req.query;
  let sqlquery = `SELECT * FROM players`;
  let results = await sqlPromise(sqlquery);
  let number = Math.floor(Math.random() * 90) + 61;
  let dictionary_out = { 'results': results, 'number': number, 'username': username };
  res.render('medium', dictionary_out);
});

app.get('/hard', async (req, res) => {
  let { username } = req.query;
  let sqlquery = `SELECT * FROM players`;
  let results = await sqlPromise(sqlquery);
  let number = Math.floor(Math.random() * 150) + 151;
  let dictionary_out = { 'results': results, 'number': number, 'username': username };
  res.render('hard', dictionary_out);
});

app.get('/impossible', async (req, res) => {
  let { username } = req.query;
  let sqlquery = `SELECT * FROM players`;
  let results = await sqlPromise(sqlquery);
  let number = Math.floor(Math.random() * 300) + 301;
  let dictionary_out = { 'results': results, 'number': number, 'username': username };
  res.render('impossible', dictionary_out);
});

app.listen(8080, "0.0.0.0", () => { console.log('server started'); });
