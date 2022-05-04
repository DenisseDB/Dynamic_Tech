const mysql = require('mysql2');
const config = require('../config');


// * Variables de entorno con base de datos alwaysdata
const pool = mysql.createPool({
   host: config.HOST,
   user: config.USER,
   database: config.DATABASE,
   password: config.PASSWORD,
   dateStrings: true,
});
// *

// * pool para db local (borrar despues)

// const pool = mysql.createPool({
//    host: 'localhost',
//    user: 'DynamicTech',
//    database: 'dynamictech_bd_feedback2',
//    password: '',
//    dateStrings: true,
// });

// *

// ! pool creado para la base de datos de la instancia --> (No usar fuera de rama main)
const DB_INSTANCIA =  mysql.createPool({
   host: config.HOST,
   user: config.USERBD,
   database: config.DATABASE,
   password: config.PASSWORD,
   port: config.PORT,
   dateStrings: true,
});
// !


module.exports = DB_INSTANCIA.promise(); // ! Se ejecuta este comando cuando queramos 
                                         // ! solo ejecutar la bd de la instancia 


// module.exports = pool.promise();
