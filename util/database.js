const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'DynamicTech',
    database: 'bd_feedback',
    password: ''
});

module.exports = pool.promise();