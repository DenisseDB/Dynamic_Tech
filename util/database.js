const mysql = require('mysql2');
const config = require('../config');


const pool = mysql.createPool({
   // connectionLimit : 10,
   host: config.DB_HOST,
   user: config.DB_USER,
   database: config.DB_DATABASE,
   password: config.DB_PASSWORD,
   // port:process.env.PORT
});

// const pool = mysql.createPool({
//    host: 'localhost',
//    user: 'DynamicTech',
//    database: 'dynamictech_bd_feedback2',
//    password: ''
// });

module.exports = pool.promise();