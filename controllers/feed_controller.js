const User = require('../models/user');
const Feed = require('../models/contestaFeed');
const Solicitud = require('../models/solicitud');
const res = require('express/lib/response');

exports.solicitudesFeedback = (request, response, next) => {
    Solicitud.fecthPeriodo()
        .then(([pd, fielData]) => {
            // Consulta. A evaluar
            Solicitud.fecthEvaluaciones(request.session.idEmpleado)
            .then(([eval, fielData]) => {

                // Consulta. Mis solicitudes
                Solicitud.fecthSolicitudes(request.session.idEmpleado)
                    .then(([sol, fielData]) => {
                        
                        // Consulta. Nueva solicitud (compañeros)
                        Solicitud.fecthEmpleados(request.session.idEmpleado)
                            .then(([emp, fielData]) => {
                                
                                response.render('solicitudFeedback.ejs',
                                    {
                                        rolesA :  request.session.privilegiosPermitidos,
                                        evaluaciones : eval,
                                        solicitudes : sol,
                                        empleados : emp,
                                        periodo : pd
                                    }
                                );
                            }).catch((error) => {
                                console.log(error);
                        });

                    }).catch((error) => {
                        console.log(error);
                    });

            }).catch((error) => {
                console.log(error);
            });

        }).catch((error) => {
            console.log(error);
        });

};

exports.nuevaSolicitud = (request, response, next) => {
    // Consulta. Cuestionarios del sesionado.
    Solicitud.fecthIDCuestionarios(request.session.craft, request.session.people, request.session.business)
        .then(([IDC, fielData]) => {
            // Consulta. ID del evaluador.
            Solicitud.fecthOneID(request.body.inputState)
                .then(([eval, fielData]) => {
                    // Consulta. Guardar nueva solicitud.
                    const solicitud =
                        new Solicitud(request.session.idEmpleado, eval[0].idEmpleado, 
                            IDC[0].idCuestionario, IDC[1].idCuestionario, IDC[2].idCuestionario, request.body.periodo, new Date());
                    solicitud.save()
                        .then(() => {
                            response.redirect('/solicitudes');
                        }).catch((error) => {
                            console.log(error);
                        });

                }).catch((error) => {
                    console.log(error);
                });
        
        }).catch((error) => {
            console.log(error);
        });        
};


exports.cuestionario =  (request, response, next) => {
    //Tomo las preguntas del cuestionario de Craft asignardo
    Feed.fecthCuestionarioCraft(request.session.idEmpleado,request.params.idEvaluado,request.params.idPeriodo)
    .then(([preguntasCraft, fieldData]) => {
        request.session.preguntasCraft = preguntasCraft;

         //Tomo las preguntas del cuestionario de People
        Feed.fecthCuestionarioPeople(request.session.idEmpleado,request.params.idEvaluado,request.params.idPeriodo)
        .then(([preguntasPeople,fieldData]) =>{
            request.session.preguntasPeople = preguntasPeople;

             //Tomo las preguntas del cuestionario de Business asignardo
            Feed.fecthCuestionarioBusiness(request.session.idEmpleado,request.params.idEvaluado,request.params.idPeriodo)
            .then(([preguntasBusiness,fieldData]) =>{
                request.session.preguntasBusiness = preguntasBusiness;

                response.render('llenarCuestionario', {

                    rolesA :  request.session.privilegiosPermitidos,
                    rol: request.session.idRol ? request.session.idRol : '',

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

exports.salvarRespuestas = async (request, response, next) => {

    console.log("Salvar respuestas");
    console.log(request.body);

    //Para facilitar el manejo de las preguntas
    let craft = request.session.preguntasCraft;
    let people = request.session.preguntasPeople;
    let bus = request.session.preguntasBusiness;

    //Para obtener cuantas preguntas fueron
    var total = craft.length + people.length + bus.length

    //Para obtener los ids de cada pregunta
    /* Recorro cada cuestinario para obtener sus ids preguntas y los guardo en 
        un array
    */
    var idP = [];
    for (i = 0; i < craft.length; i++ ) {
        idP.push(craft[i].idPregunta);
    }
    for (i = 0; i < people.length; i++ ) {
        idP.push(people[i].idPregunta);
    }
    for (i = 0; i < bus.length; i++ ) {
        idP.push(bus[i].idPregunta);
    }
 
    console.log(idP)
    //Para obtener las respuestas del body
    /* Recorro cada radio button del body para obtener sus respuesta y la guardo en 
        un array
    */
    var respuestas = [];
    for (i = 1; i <= total; i++ ) {
        respuestas.push(request.body[i]);
    }

    console.log(respuestas)

    try {
        //Ciclo for para realizar insert de preguntas y respuestas
        for (i = 0; i < total; i++ ) {
            let res = new Feed (request.params.idEvaluado, request.session.idEmpleado, idP[i],request.params.idPeriodo, respuestas[i])
            await res.save();
        }
       response.redirect('/solicitudes');

    } catch(error) {
        console.log(error)
    }
    
    

};

exports.misMentorados = (request, response, next) => {
    User.fecthMentorados(request.session.idEmpleado)
    .then(([rows, fielData]) => {
        response.render('misMentorados',
            {
                rolesA :  request.session.privilegiosPermitidos,
                rol: request.session.idRol ? request.session.idRol : '',
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
    User.fecthPrivilegios( request.session.idRol)
    .then(([rows,fielData]) => {

        request.session.privilegiosPermitidos = rows,
     
        response.render('index', { // mandamos su informacion al sidenav
            correo: request.session.correo ? request.session.correo : '',
            rolesA: rows,
            rol: request.session.idRol ? request.session.idRol : '',

        });
        
    }).catch((error) => {
        console.log(error);
    });
};