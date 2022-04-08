const db = require('../util/database');


module.exports = class {
   constructor() {}

   // Despliega todas las dimensiones disponibles 
   static fetchDimension() {
      return db.execute('SELECT dimension.nombre FROM cuestionario NATURAL join preguntacuestionario NATURAL join pregunta INNER JOIN dimension on dimension.idDimension = pregunta.idDimension order by dimension.idDimension ASC');
   }

   // Toma de la base de datos los nombres de los cuestionarios, recibe como parametro la dimension que quieres mostrar
   static fetchCuestionario(idDimension) {
      return db.execute('SELECT * FROM cuestionario NATURAL join preguntacuestionario NATURAL join pregunta INNER JOIN dimension on dimension.idDimension = pregunta.idDimension WHERE dimension.idDimension = ?;', [idDimension]);
   }

   // Toma de la base de datos las preguntas del cuestionario, recibe como parametro el id del cuestionario a obtener las preguntas 
   static fetchPreguta_Cuestionario(id_cuestionario) {
      return db.execute('SELECT pregunta FROM cuestionario NATURAL join preguntacuestionario NATURAL join pregunta INNER JOIN dimension on dimension.idDimension = pregunta.idDimension where idCuestionario = ?;', [id_cuestionario]);
   }

   // ! Metodo que ayuda a recuperar los datos de los niveles y las dimensiones

   // static fetchAll() {
   //    return db.execute('SELECT * FROM cuestionario NATURAL join preguntacuestionario NATURAL join pregunta INNER JOIN dimension on dimension.idDimension = pregunta.idDimension;');
   // }



};



// // * Codigo de la clase dimension

// //#green
// module.exports = class Dimension {

//    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
//    constructor() {

//    }

//    static fetchAll() {
//       return db.execute('SELECT * FROM Dimension ORDER BY idDimension ASC');
//    }
// };
// //#