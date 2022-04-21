const db = require('../util/database');


module.exports = class Cuestionario{
   constructor(){}

   // Despliega todas las dimensiones disponibles 
   static fetchDimension() {
      return db.execute('SELECT * FROM dimension ORDER BY idDimension ASC');
   }

   // Toma de la base de datos los nombres de los cuestionarios, recibe como parametro la dimension que quieres mostrar

   // Toma de la base de datos las preguntas del cuestionario, recibe como parametro el id del cuestionario a obtener las preguntas 
   static fetchPreguta_Cuestionario(id_cuestionario) {
      return db.execute('SELECT pregunta FROM cuestionario NATURAL join preguntacuestionario NATURAL join pregunta INNER JOIN dimension on dimension.idDimension = pregunta.idDimension where idCuestionario = ?;', [id_cuestionario]);
   }

   // !Metodo que ayuda a recuperar los datos de los niveles y las dimensiones

   static findQuestions23(nivelP, dimP) {
      return db.execute('SELECT * FROM Pregunta WHERE nivelP=? AND idDimension=?',
         [nivelP, dimP]);
   }
   
   static findQuestions(nivelP, dimP,Cuestionario) {
      return db.execute('SELECT * FROM pregunta INNER join preguntacuestionario on pregunta.idPregunta=preguntacuestionario.idPregunta INNER join cuestionario on preguntacuestionario.idCuestionario=cuestionario.idCuestionario INNER join dimension USING (idDimension)  WHERE pregunta.nivelP = ? AND pregunta.idDimension = ?   AND cuestionario.nombre= ? ORDER BY pregunta;',
         [nivelP, dimP,Cuestionario]);
   }

   static findCuestionario(nivelP,idDimension) {
      return db.execute('SELECT DISTINCT(nombre) FROM cuestionario NATURAL join preguntacuestionario NATURAL join pregunta  WHERE pregunta.nivelP = ? AND pregunta.idDimension = ? ORDER by nombre;',
         [nivelP, idDimension]);
      
   }
   static selectPreguntasDuplicate(nivelP,idDimension) {
      return db.execute('SELECT DISTINCT(nombre) FROM cuestionario NATURAL join preguntacuestionario NATURAL join pregunta  WHERE pregunta.nivelP = ? AND pregunta.idDimension = ? ORDER by nombre;',
         [nivelP, idDimension]);
      
   }

   savePreguntasCuestionario() {
      let query = 'INSERT INTO preguntaCuestionario VALUES';
      let arr = [];

      console.log(this.pregunta[0]);
      console.log(this.pregunta[1]);
      console.log(typeof this.pregunta[1] === 'undefined');


      for (let i = 0; i < this.pregunta.length; i++) {
         if (typeof this.pregunta[i] !== 'undefined') {
            query += '(LAST_INSERT_ID(), ? , CURRENT_DATE())';
            arr.push(this.pregunta[i]);

            if (typeof this.pregunta[i + 1] !== 'undefined') {
               query += ',';
            }
            else {
               query += ';';
            }

            console.log(query);
         }
      }

      return db.execute(query, arr);
   }


};
