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


module.exports = { db };
