const db = require('../util/database');


module.exports = class {
   constructor() { }

   // Despliega todas las dimensiones disponibles 
   static fetchDimension() {
      return db.execute('SELECT * FROM dimension ORDER BY idDimension ASC');
   }

   // Toma de la base de datos los nombres de los cuestionarios, recibe como parametro la dimension que quieres mostrar

   // Toma de la base de datos las preguntas del cuestionario, recibe como parametro el id del cuestionario a obtener las preguntas 
   static fetchPreguta_Cuestionario(id_cuestionario) {
      return db.execute('SELECT pregunta FROM cuestionario NATURAL join preguntacuestionario NATURAL join pregunta INNER JOIN dimension on dimension.idDimension = pregunta.idDimension where idCuestionario = ?;', [id_cuestionario]);
   }

   // ! Metodo que ayuda a recuperar los datos de los niveles y las dimensiones

   static findQuestions(nivelP, dimP) {
      return db.execute('SELECT * FROM pregunta WHERE nivelP=? AND idDimension=?',
         [nivelP, dimP]);
   }

   static findCuestionario(idDimension, nivelP) {
      return db.execute('SELECT DISTINCT(nombre) FROM cuestionario NATURAL join preguntacuestionario NATURAL join pregunta  WHERE idDimension = ? and pregunta.nivelP = ?;',
         [idDimension, nivelP]);
   }



};
