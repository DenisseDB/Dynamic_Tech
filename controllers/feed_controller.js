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
    Feed.fecthCuestionarioCraft(request.session.idEmpleado,request.params.idEvaluado,request.params.idPeriodo)
    .then(([preguntasCraft, fieldData]) => {
        Feed.fecthCuestionarioPeople(request.session.idEmpleado,request.params.idEvaluado,request.params.idPeriodo)
        .then(([preguntasPeople,fieldData]) =>{
            Feed.fecthCuestionarioBusiness(request.session.idEmpleado,request.params.idEvaluado,request.params.idPeriodo)
            .then(([preguntasBusiness,fieldData]) =>{
                response.render('llenarCuestionario', {
                    preguntasC : preguntasCraft,
                    preguntasP : preguntasPeople,
                    preguntasB : preguntasBusiness
                })
            }).catch(error => {
                console.log(error);
            });
        }).catch(error =>{
            console.log(error);
        });
       
    })
    .catch(error => console.log(error)); 

};

exports.salvarRespuestas =  (request, response, next) => {
    const respuesta = new Feed(request.body.idEmpleado,request.params.idEvaluado,request.params.idPeriodo,request.body.respuesta);
    console.log(request.body);
    respuesta.save().then(() => {
        response.redirect('/solicitudFeedback');
    }).catch(err => console.log(err));
};