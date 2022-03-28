const Feed = require('../models/contestaFeed');


exports.solicitudesFeedback = (request, response, next) => {
    Feed.fecthSolFeedback(request.session.idEmpleado)
        .then(([rows, fielData]) => {
            response.render('solicitudFeedback.ejs',
                {
                    // request.session.idEvaluado = rows[0].idEvaluado;

                    idEvaluado : request.session.idEvaluado,
                    idPeriodo : request.session.idPeriodo,
                    responder : rows,
                }

            );
        }).catch((error) => {
            console.log(error);
        });
};

exports.cuestionario =  (request, response, next) => {
    Feed.fecthCuestionario(request.session.idEmpleado,request.params.idEvaluado,request.params.idPeriodo)
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