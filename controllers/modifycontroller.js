const formatoEvaluacion = require('../models/formatoEvaluacion');
const Pregunta = require('../models/pregunta'); // Se importa la clase pregunta para hacer una busqueda por 
                                               // preguntas dependiendo el nivel y la dimension
const Cuestionario = require('../models/Cuestionario');

const {
   route
} = require('../routes/createfb.routes');

exports.root = (request, response, next) => {
   response.render('formatosEvaluacion');
};


exports.modificarFormato = (request, response, next) => {

   Cuestionario.fetchDimension()
      .then(([dimension, fielData]) => {
         response.render('modificarFormato', {
            dimensiones: dimension,
         });
      }).catch((error) => {
         console.log(error);
      });



};




exports.modificarFormato_post = (request, response, next) => {

   //console.log("Controlador:");
   //console.log(request.body);
   let preguntas = [request.body.pregunta0, request.body.pregunta1];
   const formatoEvaluacion = new FormatoEvaluacion(request.body.nombreCuestionario, request.body.inputDimension, request.body.inputNivel, preguntas);
   formatoEvaluacion.saveCuestionario()
      .then(() => {
         formatoEvaluacion.savePreguntasCuestionario()
            .then(() => {
               response.render('formatosEvaluacion');
            })
            .catch(err => {
               console.log(err);
            });
      })
      .catch(err => {
         console.log(err);
      });
   //response.render('generarFormatos', {
   //});
};



exports.buscarCuestionario= (request, response, next)=> {
   console.log(request.params.nivel);
   console.log(request.params.dim);
   console.log('buscar_cuestionario');
   Cuestionario.findCuestionario(request.params.nivel, request.params.dim)
      .then(([rows, fieldData]) => {
         console.log(rows);
         response.status(200).json(rows);
      })
      .catch(err => {
         console.log(err);
      });
};


exports.buscarPregunta= (request, response, next)=> {
   console.log(request.params.nivel);
   console.log(request.params.dim);
   console.log('buscar_Pregunta');
   Cuestionario.findQuestions(request.params.nivel, request.params.dim)
      .then(([rows, fieldData]) => {
         console.log(rows);
         response.status(200).json(rows);
      })
      .catch(err => {
         console.log(err);
      });
};









// exports.modificarFormato = (request, response, next) => {
//    Dimension.fetchAll()
//       .then(([rows, fielData]) => {

//          response.render('modificarFormato', {
//             dimensiones: rows
//          });
//       }).catch((error) => {
//          console.log(error);
//       });


// };
// exports.modificarFormato_Cuestionario = (request, response, next) => {
//    Cuestionario.fetchAll()
//       .then(([rows, fielData]) => {
//          response.render('modificarFormato', {
//             cuestionarios: rows
//          });
//       }).catch((error) => {
//          console.log(error);
//       });





// };