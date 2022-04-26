const mysql = require('mysql2');
const config = require('../config');

// const pool = mysql.createPool({
//    host: config.HOST,
//    user: config.USER,
//    database: config.DATABASE,
//    password: config.PASSWORD,
// });

const pool = mysql.createPool({
   host: 'mysql-dynamictech.alwaysdata.net',
   user: '263275',
   database: 'dynamictech_bd_feedback2',
   password: 'contraseña123.'
});

const DB_INSTANCIA = {
   host: 'localhost',
   user: 'admin',
   database: 'dynamictech_bd_feedback2',
   password: 'dynamic123.',
   port: 3000
};



module.exports = pool.promise(DB_INSTANCIA);