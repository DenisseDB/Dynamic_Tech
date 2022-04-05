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


exports.modificarFormato = (request, response, next) => {


   Cuestionario.fetchCustionario()
      .then(([rows, fielData]) => {

         response.render('modificarFormato', {

         });
      }).catch((error) => {
         console.log(error);
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