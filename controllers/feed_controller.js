const Feed = require('../models/contestaFeed');


exports.solicitudesFeedback = (request, response, next) => {
    Feed.fecthSolFeedback(request.session.idEmpleado)
        .then(([rows, fielData]) => {
            response.render('solicitudFeedback.ejs',
                {
                    // request.session.idEvaluado = rows[0].idEvaluado;

                    idEvaluado : request.session.idEvaluado,
                    responder : rows,
                }

            );
        }).catch((error) => {
            console.log(error);
        });
};

// exports.solicitudesFeedback = (request, response, next) => {
//     Feed.findPeriodo()
//         .then(([periodo, fielData]) => {
//             Feed.fecthSolFeedback(request.session.idEmpleado,periodo.idPeriodo)
//             .then(([rows, fielData]) => {
//                 response.render('solicitudFeedback.ejs',
//                     {
//                         periodo : periodo,
//                         responder : rows,
//                     }
    
//                 );
//             }).catch((error) => {
//                 console.log(error);
//             });
//         }).catch((error) => {
//             console.log(error);
//         });
// };

exports.cuestionario =  (request, response, next) => {
    Feed.fecthCuestionario(request.session.idEmpleado,request.session.idEvaluador)
        .then(([rows, fielData]) => {
            response.render('llenarCuestionario.ejs',
                {
                    preguntas : rows,
                }

            );
        }).catch((error) => {
            console.log(error);
        });
};