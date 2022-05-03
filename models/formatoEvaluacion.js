const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class formatoEvaluacion {

   // Constructor de la clase. Sirve para creaFr un nuevo objeto, y en él se definen las propiedades del modelo
   constructor(nuevo_nombre, nueva_dimension, nuevo_nivel) {
      this.nombre = nuevo_nombre;
      this.nivel = nuevo_nivel;
      this.dimension = nueva_dimension;
   }

   static fetchCuestionarios() {
      return db.execute('SELECT DISTINCT nombre, idCuestionario, fecha, idDimension, nivelC FROM cuestionario_actual CA ORDER BY idDimension,nivelC ASC');
   }

   // Este método servirá para guardar de manera persistente el nuevo objeto. 
   saveCuestionario() {
      return db.execute('INSERT INTO cuestionario(nombre, fecha, nivelC, idDimension) VALUES(?, CURRENT_TIMESTAMP(), ?, ?); ',
         [this.nombre, this.nivel, this.dimension]);
   }

   static savePreguntasCuestionario(array) {
      let query = 'INSERT INTO preguntacuestionario VALUES';

      for (let i = 0; i < array.length; i++) {
         query += '(LAST_INSERT_ID(), ?, CURRENT_DATE())';

         if (i < (array.length) - 1) {
            query += ',';
         } else {
            query += ';';
         }
      }
      return db.execute(query, array);
   }
};