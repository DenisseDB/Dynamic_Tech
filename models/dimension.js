const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class Dimension {

   // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
   constructor() {

   }

   static fetchAll() {
      return db.execute('SELECT * FROM Dimension ORDER BY idDimension ASC');
   }
};