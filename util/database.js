const mysql = require('mysql2');
const config = require('../config');

/*const pool = mysql.createPool({
   host: config.HOST,
   user: config.USER,
   database: config.DATABASE,
   password: config.PASSWORD,
});*/
   
const pool = mysql.createPool({
   host: 'mysql-dynamictech.alwaysdata.net',
   user: '263275',
   database: 'dynamictech_bd_feedback2',
   password: 'contraseña123.'
});

// const pool = mysql.createPool({
//    host: 'localhost',
//    user: 'DynamicTech',
//    database: 'dynamictech_bd_feedback3',
//    password: ''
// });

// const pool = mysql.createPool({
//    host: 'localhost',
//    user: 'DynamicTech',
//    database: 'dynamictech_bd_feedback2',
//    password: ''
// });

module.exports = pool.promise();