const db = require('../util/database');


module.exports = class Cuestionario {
   constructor() {

   }

   static fetchAll() {
      return db.execute('SELECT * ');
   }
};