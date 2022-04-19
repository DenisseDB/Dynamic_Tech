const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'mysql-dynamictech.alwaysdata.net',
    user: '263275',
    database: 'dynamictech_bd_feedback2',
    password: 'contraseña123.'
});

module.exports = pool.promise();