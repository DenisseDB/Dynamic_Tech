const Feed = require('../models/contestaFeed');


// exports.solicitudesFeedback= (request, response, next) => {
//     response.render('solicitudFeedback.ejs', {
//         correo: request.session.correo ? request.session.correo : '',
//         info: ''
//     });
// };


exports.solicitudesFeedback = (request, response, next) => {
   Feed.fecthSolFeedback(request.session.idEmpleado)
      .then(([rows, fielData]) => {
         response.render('solicitudFeedback.ejs', {
               responder: rows,
            }

         );
      }).catch((error) => {
         console.log(error);
      });
};