const User = require('../models/user');
const Feed = require('../models/contestaFeed');
const Solicitud = require('../models/solicitud');
const res = require('express/lib/response');

exports.solicitudesFeedback = async (request, response, next) => {
    const pd = await Solicitud.fecthPeriodo(); // Periodo de evaluación.
    const eval = await Solicitud.fecthEvaluaciones(request.session.idEmpleado); // A evaluar.
    const sol = await Solicitud.fecthSolicitudes(request.session.idEmpleado); // Mis Solicitudes.
    request.session.solicitudes = sol.length; // N. Solicitudes.

    let nsuccess = request.session.success;
    request.session.success = '';

    // Rango de fechas (para solicitar/responder feedback).
    const d = new Date();
    const date = new Date(d.toDateString());

    let inicio = pd[0].fecha_inicial;
    inicio = new Date(inicio.toDateString());

    let final = pd[0].fecha_final;
    final = new Date(final.toDateString());

    Solicitud.fecthEmpleados(request.session.idEmpleado)
        .then(([emp, fielData]) => {

            response.render('solicitudFeedback.ejs',
                {
                    rolesA: request.session.privilegiosPermitidos,
                    periodo: pd,
                    evaluaciones: eval,
                    solicitudes: sol,
                    empleados: emp,
                    fecha: date,
                    fecha_i: inicio,
                    fecha_f: final,
                    nombreSesion: request.session.nombreSesion,
                    apellidoPSesion: request.session.apellidoPSesion,
                    foto: request.session.foto,
                    notificacion: nsuccess ? nsuccess : ''
                }
            );
        }).catch((error) => {
            console.log(error);
        });

};

exports.nuevaSolicitud = async (request, response, next) => {
    let evaluadores = request.body.nombre; // Nombre(s) de compañeros evaluadores.
    let arr = Array.isArray(evaluadores); // ¿evaluadores es un array?
    let str = typeof evaluadores === 'string'; // ¿evaluadores es un array?
    let n_solicitudes = request.session.solicitudes;

    if (arr && ((n_solicitudes + evaluadores.length) <= 7)) {
        const IDC = await Solicitud.fecthIDCuestionarios(request.session.craft,
            request.session.people, request.session.business); // Cuestionarios del sesionado.

        for await (let evaluador of evaluadores) {
            const IDE = await Solicitud.fecthOneID(evaluador); // ID del evaluador.

            const solicitud = new Solicitud(request.session.idEmpleado, IDE[0].idEmpleado,
                IDC[0].idCuestionario, IDC[1].idCuestionario, IDC[2].idCuestionario,
                request.body.periodo, new Date()); // Nueva solicitud.

            solicitud.save();
        }
        request.session.success = 1;

    } else if (str && ((n_solicitudes + 1) <= 7)) {
        const IDC = await Solicitud.fecthIDCuestionarios(request.session.craft,
            request.session.people, request.session.business); // Cuestionarios del sesionado.

        const IDE = await Solicitud.fecthOneID(evaluadores); // ID del evaluador.

        const solicitud = new Solicitud(request.session.idEmpleado, IDE[0].idEmpleado,
            IDC[0].idCuestionario, IDC[1].idCuestionario, IDC[2].idCuestionario,
            request.body.periodo, new Date()); // Nueva solicitud.

        solicitud.save();

        request.session.success = 1;
    } else {
        request.session.success = 2;
    }

    response.redirect('/solicitudes');
};


exports.cuestionario = (request, response, next) => {
    //Tomo las preguntas del cuestionario de Craft asignardo
    Feed.fecthCuestionarioCraft(request.session.idEmpleado, request.params.idEvaluado, request.params.idPeriodo)
        .then(([preguntasCraft, fieldData]) => {
            request.session.preguntasCraft = preguntasCraft;

            //Tomo las preguntas del cuestionario de People
            Feed.fecthCuestionarioPeople(request.session.idEmpleado, request.params.idEvaluado, request.params.idPeriodo)
                .then(([preguntasPeople, fieldData]) => {
                    request.session.preguntasPeople = preguntasPeople;

                    //Tomo las preguntas del cuestionario de Business asignardo
                    Feed.fecthCuestionarioBusiness(request.session.idEmpleado, request.params.idEvaluado, request.params.idPeriodo)
                        .then(([preguntasBusiness, fieldData]) => {
                            request.session.preguntasBusiness = preguntasBusiness;

                            response.render('llenarCuestionario', {

                                rolesA: request.session.privilegiosPermitidos,
                                rol: request.session.idRol ? request.session.idRol : '',

                                preguntasC: preguntasCraft,
                                preguntasP: preguntasPeople,
                                preguntasB: preguntasBusiness,

                                nombreSesion: request.session.nombreSesion,
                                apellidoPSesion: request.session.apellidoPSesion,
                                foto: request.session.foto,
                            })
                        }).catch(error => {
                            console.log(error);
                        });
                }).catch(error => {
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
    var total = craft.length + people.length + bus.length;

    //Para obtener los ids de cada pregunta
    /* Recorro cada cuestinario para obtener sus ids preguntas y los guardo en 
        un array
    */
    var idP = [];
    for (i = 0; i < craft.length; i++) {
        idP.push(craft[i].idPregunta);
    }
    for (i = 0; i < people.length; i++) {
        idP.push(people[i].idPregunta);
    }
    for (i = 0; i < bus.length; i++) {
        idP.push(bus[i].idPregunta);
    }

    console.log(idP);
    //Para obtener las respuestas del body
    /* Recorro cada radio button del body para obtener sus respuesta y la guardo en 
        un array
    */
    var respuestas = [];
    for (i = 1; i <= total; i++) {
        respuestas.push(request.body[i]);
    }

    console.log(respuestas);

    try {
        //Ciclo for para realizar insert de preguntas y respuestas
        for (i = 0; i < total; i++) {
            let res = new Feed(request.params.idEvaluado, request.session.idEmpleado, idP[i], request.params.idPeriodo, respuestas[i])
            await res.save();
        }
        response.redirect('/solicitudes');

    } catch (error) {
        console.log(error);
    }



};

exports.misMentorados = (request, response, next) => {
    User.fecthMentorados(request.session.idEmpleado)
        .then(([rows, fielData]) => {
            response.render('misMentorados',
                {
                    rolesA: request.session.privilegiosPermitidos,
                    rol: request.session.idRol ? request.session.idRol : '',
                    // TODO ESTO SE ENVIA A MISMENTORADOS.EJS
                    mentorados: rows, // llevar los mentorados
                    nombre: request.session.nombreSesion, // sacar su nombre
                    correo: request.session.correo,  // correo del usurio que esta en header
                    rol: request.session.idRol, // obtener rol del usario
                    nombreSesion: request.session.nombreSesion,
                    apellidoPSesion: request.session.apellidoPSesion,
                    foto: request.session.foto,
                }

            );
        }).catch((error) => {
            console.log(error);
        });
};

exports.home = (request, response, next) => {
    User.fecthPrivilegios(request.session.idRol)
        .then(([rows, fielData]) => {

            request.session.privilegiosPermitidos = rows,

                response.render('index', { // mandamos su informacion al sidenav

                    foto: request.session.foto,
                    nombreSesion: request.session.nombreSesion,
                    apellidoPSesion: request.session.apellidoPSesion,
                    correo: request.session.correo ? request.session.correo : '',
                    rolesA: rows,
                    rol: request.session.idRol ? request.session.idRol : '',
                    idEmpleado: request.session.idEmpleado ? request.session.idEmpleado : '',
                });

        }).catch((error) => {
            console.log(error);
        });
};