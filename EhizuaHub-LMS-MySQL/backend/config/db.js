const mysql = require('mysql');
require('dotenv').config();

// .............. Ehizua MySQL Database Connection ............
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ehizua'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Ehizua MySql Connected.....');
});

// .............. School MySQL Database Connection ............
const sch = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'Schools'
});

sch.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('School MySql Connected.....');
});


module.exports = { db, sch};
