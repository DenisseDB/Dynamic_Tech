const User = require('../models/user');
const Feed = require('../models/contestaFeed');
const Solicitud = require('../models/solicitud');

exports.solicitudesFeedback = async (request, response, next) => {
    const pd = await Solicitud.fecthPeriodo(); // Periodo de evaluación.
    const eval = await Solicitud.fecthEvaluaciones(request.session.idEmpleado); // A evaluar.
    const sol = await  Solicitud.fecthSolicitudes(request.session.idEmpleado); // Mis Solicitudes.

    Solicitud.fecthEmpleados(request.session.idEmpleado)
        .then(([emp, fielData]) => {
            
            response.render('solicitudFeedback.ejs',
                {
                    periodo : pd,
                    evaluaciones : eval,
                    solicitudes : sol,
                    empleados : emp
                }
            );
        }).catch((error) => {
            console.log(error);
    });

};

exports.nuevaSolicitud = async (request, response, next) => {
    const IDC = await Solicitud.fecthIDCuestionarios(request.session.craft, 
        request.session.people, request.session.business); // Cuestionarios del sesionado.

    const IDE = await Solicitud.fecthOneID(request.body.inputState); // ID del evaluador.

    const solicitud = new Solicitud(request.session.idEmpleado, IDE[0].idEmpleado, 
        IDC[0].idCuestionario, IDC[1].idCuestionario, IDC[2].idCuestionario, request.body.periodo, new Date()); // Nueva solicitud.
    
    solicitud.save()
        .then(() => {
            response.redirect('/solicitudes');
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

    const respuesta = new Feed(request.session.idEmpleado,request.params.idEvaluado,request.body.idPregunta,request.params.idPeriodo,request.body.value);
    console.log(request.body);
    respuesta.save().then(() => {
        response.redirect('/solicitudFeedback');
    }).catch(err => console.log(err));
    
};

exports.misMentorados = (request, response, next) => {
    User.fecthMentorados(request.session.idEmpleado)
        .then(([rows, fielData]) => {
            response.render('misMentorados',
                {
                    // TODO ESTO SE ENVIA A MISMENTORADOS.EJS
                    mentorados: rows, // llevar los mentorados
                    nombre: request.session.nombre, // sacar su nombre
                    correo: request.session.correo,  // correo del usurio que esta en header
                    rol: request.session.idRol, // obtener rol del usario
                }

            );
        }).catch((error) => {
            console.log(error);
        });
};

exports.home = (request, response, next) => {
    User.rolMentorados()
    .then(([rows,fielData]) => {

        request.session.rolesPermitidos = rows,
     
        response.render('index', { // mandamos su informacion al sidenav
            correo: request.session.correo ? request.session.correo : '',
            rolesA: rows,
            rol: request.session.idRol ? request.session.idRol : '',
        });
        
    }).catch((error) => {
        console.log(error);
    });
};