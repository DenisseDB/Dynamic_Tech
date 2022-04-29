const dotenv = require('dotenv').config();

// * Variables de entorno con base de datos alwaysdata
// module.exports = {
//    HOST: process.env.HOST || '',
//    USER: process.env.USER || '',
//    DATABASE: process.env.DATABASE || '',
//    PASSWORD: process.env.PASSWORD || ''
// };
// *

//! Llamada a variable de entorno de la instancia
module.exports = {
   HOST: process.env.HOST || '',
   USER: process.env.USER || '',
   DATABASE: process.env.DATABASE || '',
   PASSWORD: process.env.PASSWORD || '',
   PORT: process.env.PORT || ''
};
// !
