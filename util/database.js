const mysql = require('mysql2');
const config = require('../config');


const pool = mysql.createPool({
   host: config.HOST,
   user: config.USER,
   database: config.DATABASE,
   password: config.PASSWORD,
});

// const pool = mysql.createPool({
//    host: 'localhost',
//    user: 'DynamicTech',
//    database: 'dynamictech_bd_feedback2',
//    password: ''
// });

module.exports = pool.promise();