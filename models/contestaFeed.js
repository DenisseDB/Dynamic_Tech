const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class Feedback {

   //Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
   constructor() {
      this.idEvaluado = Evaluado;
      this.idEvaluador = Evaluador;
      this.idCuestionario = CuestionarioNivel;
      this.idPeriodo = Periodo;
   }

   // //Este método servirá para guardar de manera persistente el nuevo objeto. 
   save() {
      return db.execute('INSERT INTO retroalimentacion (idEvaluado, idEvaluador,idCuestionario,idPeriodo) VALUES (?, ?,?,?)',
         [this.idEvaluado, this.idEvaluador, this.idCuestionario, this.idEvaluador]
      );
   }

   static fecthSolFeedback(idEvaluador) {
      return db.execute('SELECT nombre, apellidoP, apellidoM, estatus FROM empleado, retroalimentacion WHERE empleado.idEmpleado = retroalimentacion.idEvaluado and idEvaluador = ?;',
         [idEvaluador]);

   }

   //Este método servirá para devolver los objetos del almacenamiento persistente.
   static findOne(correo) {
      return db.execute('SELECT nombre,correo,E.idEmpleado,idRol FROM empleado E, rolEmpleado RE WHERE E.idEmpleado = RE.idEmpleado AND correo=?',
         [correo]);
   }

}