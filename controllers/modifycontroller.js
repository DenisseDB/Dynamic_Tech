const formatoEvaluacion = require('../models/formatoEvaluacion');

// const Dimension = require('../models/dimension');
// const Pregunta = require('../models/pregunta');

const Cuestionario = require('../models/Cuestionario');

const {
   route
} = require('../routes/createfb.routes');

exports.root = (request, response, next) => {
   response.render('formatosEvaluacion');
};


exports.modificarFormato2 = (request, response, next) => {

   Cuestionario.fetchDimension()
      .then(([dimension, fielData]) => {

         Cuestionario.fetchCuestionario(request.params.idDimension)
            .then(([cuesti, fielData]) => {

               Cuestionario.fetchPreguta_Cuestionario(request.params.idCuestionario)
                  .then(([pregunta, fielData]) => {
                     response.render('modificarFormato', {

                        dimensiones: dimension,
                        preguntas: pregunta,
                        cuestionarios: cuesti,

                     }).catch((error) => {
                        console.log(error);
                     });

                  }).catch((error) => {
                     console.log(error);
                  });

            }).catch((error) => {
               console.log(error);
            });

      });
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