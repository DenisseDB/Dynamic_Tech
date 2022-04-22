const mysql = require('mysql2');
// require('dotenv').config({path: './.env'});


const pool = mysql.createPool({
   connectionLimit : 10,
   host: process.env.HOST,
   user: process.env.USER,
   password: process.env.PASSWORD,
   database: process.env.DATABASE,
   port:process.env.PORT
});

// const pool = mysql.createPool({
//    host: 'localhost',
//    user: 'DynamicTech',
//    database: 'dynamictech_bd_feedback2',
//    password: ''
// });

module.exports = pool.promise();