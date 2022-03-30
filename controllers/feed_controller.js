const User = require('../models/user');
const Feed = require('../models/contestaFeed');
const Solicitudes = require('../models/solicitud');

exports.solicitudesFeedback = (request, response, next) => {
    Solicitudes.fecthSolicitudes(request.session.idEmpleado)
        .then(([rows, fielData]) => {

            Solicitudes.fecthEmpleados(request.session.idEmpleado)
                .then(([rows1, fielData]) => {
                    
                    response.render('solicitudFeedback.ejs',
                        {
                            empleados : rows1,
                            solicitudes : rows
                        }
                    );
                }).catch((error) => {
                    console.log(error);
            });

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