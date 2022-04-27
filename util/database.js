const mysql = require('mysql2');
const config = require('../config');

const pool = mysql.createPool({
   host: config.HOST,
   user: config.USER,
   database: config.DATABASE,
   password: config.PASSWORD,
});

module.exports = pool.promise();