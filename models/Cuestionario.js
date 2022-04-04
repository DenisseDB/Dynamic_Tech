const db = require('../util/database');


module.exports = class Cuestionario {
   constructor() {

   }

   // static fetchAll() {
   //    return db.execute('SELECT cuestionario.nombre FROM cuestionario NATURAL join preguntacuestionario NATURAL join pregunta INNER JOIN dimension on dimension.idDimension = pregunta.idDimension');
   // }
   static fetchAll() {
      return db.execute('SELECT * FROM cuestionario NATURAL join preguntacuestionario NATURAL join pregunta INNER JOIN dimension on dimension.idDimension = pregunta.idDimension;');
   }

};