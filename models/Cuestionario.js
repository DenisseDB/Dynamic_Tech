const db = require('../util/database');


module.exports = class Cuestionario {
   constructor() {

   }

   static fetchCustionario() {
      return db.execute('SELECT cuestionario.nombre FROM cuestionario NATURAL join preguntacuestionario NATURAL join pregunta INNER JOIN dimension on dimension.idDimension = pregunta.idDimension');
   }

   static fetchPreguta_Cuestionario(id_cuestionario) {
      return db.execute('SELECT pregunta FROM cuestionario NATURAL join preguntacuestionario NATURAL join pregunta INNER JOIN dimension on dimension.idDimension = pregunta.idDimension where idCuestionario = ?;', [id_cuestionario]);
   }


   static fetch(id_cuestionario) {
      return db.execute('SELECT pregunta FROM cuestionario NATURAL join preguntacuestionario NATURAL join pregunta INNER JOIN dimension on dimension.idDimension = pregunta.idDimension where idCuestionario = ?;', [id_cuestionario]);
   }






   // ! Metodo que ayuda a recuperar los datos de los niveles y las dimensiones

   // static fetchAll() {
   //    return db.execute('SELECT * FROM cuestionario NATURAL join preguntacuestionario NATURAL join pregunta INNER JOIN dimension on dimension.idDimension = pregunta.idDimension;');
   // }

};



// * Codigo de la clase dimension

//#green
module.exports = class Dimension {

   // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
   constructor() {

   }

   static fetchAll() {
      return db.execute('SELECT * FROM Dimension ORDER BY idDimension ASC');
   }
};
//#