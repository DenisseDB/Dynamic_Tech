const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class Pregunta {

   //Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
   constructor() {

   }

   static findQuestions(nivelP, dimP) {
      return db.execute('SELECT * FROM Pregunta WHERE nivelP=? AND idDimension=?',
         [nivelP, dimP]);
   }
   // static findQuestions(nivelP, idDimension) {
   //    return db.execute('SELECT * FROM Pregunta WHERE nivelP=? AND idDimension=?',
   //       [nivelP, idDimension]);
   // }

   // static findQuestions() {
   //    return db.execute('SELECT * FROM Pregunta');
   // }
}