import express from 'express';
import sqlite3 from 'sqlite3';

const homeTeam = 'Galatasaray';
const awayTeam = 'Young Boys';

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());

app.get('/', (req, res, next) => {
  console.log(`get requested from ${req.url}`);

  let db = new sqlite3.Database('matchDb.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return next({ status: 500, message: 'nu s-a putut conecta la db' });
    }
    console.log('Connected to database');
    db.serialize(() => {
      let returnedData = { homeTeam: {}, awayTeam: {} };
      /////////////////////hometeam//////////////////////////////////
      db.get('SELECT avg(homeScore + awayScore) as "totalAverageGoals" FROM homeTeam', (err, row) => {
        if (err) {
          return next({ status: 500, message: 'ceva nu a mers bine' });
        }
        Object.assign(returnedData.homeTeam, row);
      });
      db.all(
        'SELECT * FROM homeTeam WHERE home = $homeTeam AND homeScore = (SELECT max(homeScore) FROM homeTeam WHERE home = $homeTeam)',
        { $homeTeam: homeTeam },
        (err, rows) => {
          if (err) {
            return next({ status: 500, message: 'ceva nu a mers bine' });
          }
          Object.assign(returnedData.homeTeam, { mostGoalsHome: rows });
        }
      );
      db.all(
        'SELECT * FROM homeTeam WHERE away = $homeTeam AND awayScore = (SELECT max(awayScore) FROM homeTeam WHERE away = $homeTeam)',
        { $homeTeam: homeTeam },
        (err, rows) => {
          if (err) {
            return next({ status: 500, message: 'ceva nu a mers bine' });
          }
          Object.assign(returnedData.homeTeam, { mostGoalsAway: rows });
        }
      );
      db.all(
        'SELECT "homeAverageGoals" as "averageGoals", avg(homeScore) as "qty" FROM homeTeam WHERE home = $homeTeam UNION SELECT "awayAverageGoals", avg(awayScore) FROM homeTeam WHERE away = $homeTeam',
        { $homeTeam: homeTeam },
        (err, rows) => {
          if (err) {
            return next({ status: 500, message: 'ceva nu a mers bine' });
          }
          Object.assign(returnedData.homeTeam, { averageGoals: rows });
        }
      );
      /////////////////////end hometeam//////////////////////////////////
      /////////////////////awayteam//////////////////////////////////
      db.get('SELECT avg(homeScore + awayScore) as "totalAverageGoals" FROM awayTeam', (err, row) => {
        if (err) {
          return next({ status: 500, message: 'ceva nu a mers bine' });
        }
        Object.assign(returnedData.awayTeam, row);
      });
      db.all(
        'SELECT * FROM awayTeam WHERE home = $awayTeam AND homeScore = (SELECT max(homeScore) FROM awayTeam WHERE home = $awayTeam)',
        { $awayTeam: awayTeam },
        (err, rows) => {
          if (err) {
            return next({ status: 500, message: 'ceva nu a mers bine' });
          }
          Object.assign(returnedData.awayTeam, { mostGoalsHome: rows });
        }
      );
      db.all(
        'SELECT * FROM awayTeam WHERE away = $awayTeam AND awayScore = (SELECT max(awayScore) FROM awayTeam WHERE away = $awayTeam)',
        { $awayTeam: awayTeam },
        (err, rows) => {
          if (err) {
            return next({ status: 500, message: 'ceva nu a mers bine' });
          }
          Object.assign(returnedData.awayTeam, { mostGoalsAway: rows });
        }
      );
      db.all(
        'SELECT "homeAverageGoals" as "averageGoals", avg(homeScore) as "qty" FROM awayTeam WHERE home = $awayTeam UNION SELECT "awayAverageGoals", avg(awayScore) FROM awayTeam WHERE away = $awayTeam',
        { $awayTeam: awayTeam },
        (err, rows) => {
          if (err) {
            return next({ status: 500, message: 'ceva nu a mers bine' });
          }
          Object.assign(returnedData.awayTeam, { averageGoals: rows });
          //ends the request-response cycle
          // res.status(200).json({
          //   status: 'ok',
          //   body: returnedData,
          // });
          res.render('index', {
            message: returnedData,
          });
        }
      );
      /////////////////////end awayteam//////////////////////////////////
    });
    db.close((err) => {
      if (err) {
        console.log(err.message);
      }
      console.log('Close the database connection.');
    });
  });
});

//redirects
app.all('*', (req, res) => {
  res.status(404).send('<h3>404 Not found!</h3>');
});

//errors
app.use((err, req, res, next) => {
  res.status(err.status).json(err);
  console.error(err.message);
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});
