const mysql = require('mysql2');

/*const pool = mysql.createPool({
    host: 'mysql-dynamictech.alwaysdata.net',
    user: '263275',
    database: 'dynamictech_bd_feedback1',
    password: 'contraseña123.'
});*/

const pool = mysql.createPool({
   host: 'localhost',
   user: 'DynamicTech',
   database: 'bd_feedback2',
   password: ''
});
module.exports = pool.promise();