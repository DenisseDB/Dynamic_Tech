const formatoEvaluacion = require('../models/formatoEvaluacion');
const Dimension = require('../models/dimension');
const Pregunta = require('../models/pregunta');

const {
   route
} = require('../routes/createfb.routes');

exports.root = (request, response, next) => {
   response.render('formatosEvaluacion');
};




exports.buscarFormato = (request, response, next) => {
   console.log(request.params.nivel);
   console.log(request.params.dim);
   console.log('buscar');
   Pregunta.findQuestions(request.params.nivel, request.params.dim)
      .then(([rows, fieldData]) => {
         console.log(rows);
         response.status(200).json(rows);
      })
      .catch(err => {
         console.log(err);
      });
};

exports.generarFormato = (request, response, next) => {
   Dimension.fetchAll()
      .then(([rows, fielData]) => {
         response.render('generarFormatos', {
            dimensiones: rows
         });
      }).catch((error) => {
         console.log(error);
      });
};

exports.modificarFormato = (request, response, next) => {
   Dimension.fetchAll()
      .then(([rows, fielData]) => {

         response.render('modificarFormato', {
            dimensiones: rows
         });
      }).catch((error) => {
         console.log(error);
      });


};