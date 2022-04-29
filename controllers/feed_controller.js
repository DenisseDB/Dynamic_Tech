const User = require('../models/user');
const Feed = require('../models/contestaFeed');
const Solicitud = require('../models/solicitud');
const Historial = require('../models/historico');
const res = require('express/lib/response');

exports.solicitudesFeedback = async (request, response, next) => {
   const pd = await Solicitud.fecthLastPeriodo(); // Último periodo de evaluación.
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

   const pa = (inicio <= date) && (final >= date);

   Solicitud.fecthEmpleados(request.session.idEmpleado)
      .then(([emp, fielData]) => {

         response.render('solicitudFeedback.ejs', {
            rolesA: request.session.privilegiosPermitidos,
            periodo: pd,
            evaluaciones: eval,
            solicitudes: sol,
            empleados: emp,
            fecha: pa,
            fecha_i: inicio,
            fecha_f: final,
            nombreSesion: request.session.nombreSesion,
            apellidoPSesion: request.session.apellidoPSesion,
            foto: request.session.foto,
            notificacion: nsuccess ? nsuccess : ''
         });
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

exports.miFeedback =  async (request, response, next) => {
    const pds = await Historial.fetchAllPeriodo(); // Periodos de evaluación.
    const hs = await Historial.fetchFeedHistorico(request.session.idEmpleado); // Histórico de solicitudes respondidas.
    const dsG = await Historial.fetchDesempenioG(request.session.idEmpleado); // Promedio de Desempeño por Periodo (General).
    let dsI = [];

   for await (let x of hs) {
      let especifico = await Historial.fetchDesempenioE(x.idCuestionarioCraft, x.idCuestionarioPeople, x.idCuestionarioBusiness,
         request.session.idEmpleado, x.idEvaluador, x.idPeriodo);
      dsI.push(especifico);
   }

    console.log(dsG);

    response.render('miFeedback.ejs',
    {
        idSesionado: request.session.idEmpleado,
        rolesA :  request.session.privilegiosPermitidos,
        periodos : pds,
        retroalimentaciones : hs,
        especifico : dsI,
        general: dsG,
        nombre_empleado: '',
        apellido_empleado: '',
        nombreSesion: request.session.nombreSesion,
        apellidoPSesion: request.session.apellidoPSesion,
        foto: request.session.foto,
        idEmpleado: request.session.idEmpleado ? request.session.idEmpleado : '',
        nivel_craftpg: request.session.craft ? request.session.craft : '',
        nivel_peoplepg: request.session.people ? request.session.people : '',
        nivel_businesspg: request.session.business ? request.session.business : '',
        ruta : '/miFeedback'
    });
};

exports.detalleFeedback = async (request, response, next) => {
   let evaluador = request.body.IdEval;
   let periodo = request.body.IdPed;
   let evaluado = request.session.idEmpleado;
   let idcraft = request.body.IdCraft;
   let idPeople = request.body.IdPeople;
   let idCommercial = request.body.IdCommercial;

   const rCraft = await Historial.fetchFeedDetallado(idcraft, evaluado, evaluador, periodo); // Retro del Cuestionario Craft.
   const rPeople = await Historial.fetchFeedDetallado(idPeople, evaluado, evaluador, periodo); // Retro del Cuestionario People.
   const rBusiness = await Historial.fetchFeedDetallado(idCommercial, evaluado, evaluador, periodo); // Retro del Cuestionario Business.
   const sol = await Historial.fetchSolicitud(evaluado, evaluador, periodo); // Detalle del Periodo y Evaluador.
   const lvl = await Historial.fetchNiveles(idcraft, idPeople, idCommercial); // Detalle de los niveles al momento de la solicitud.

    response.render('detalleFeedback.ejs',
    {
        rolesA :  request.session.privilegiosPermitidos,
        craft : rCraft,
        people : rPeople,
        business : rBusiness,
        solicitud : sol,
       niveles: lvl,
       nombre_empleado: '',
       apellido_empleado: '',
       id_empleado: '',
        nombreSesion: request.session.nombreSesion,
        apellidoPSesion: request.session.apellidoPSesion,
         foto: request.session.foto,
         self: '',
         ruta : '/detalleFeedback'
    });
};

exports.miFeedback_id = async (request, response, next) => {

   const empleado = request.params.id; // Empleado para el cual se consulta su feedback.
   console.log('mi' + request.params.id);
    const niv = await User.fetchDimensiones_actuales(empleado); // Nivel del empleado de la consulta.
    const nom = await User.fetchNombre(empleado); // Nombre del empleado de la consulta.
    const pds = await Historial.fetchAllPeriodo(); // Periodos de evaluación.
    const hs = await Historial.fetchFeedHistorico(empleado); // Histórico de solicitudes respondidas.
    const dsG = await Historial.fetchDesempenioG(empleado); // Promedio de Desempeño por Periodo (General).
    let dsI = [];

    for await (let x of hs) {
        let especifico = await Historial.fetchDesempenioE(x.idCuestionarioCraft, x.idCuestionarioPeople, x.idCuestionarioBusiness,
            empleado, x.idEvaluador, x.idPeriodo);
        dsI.push(especifico);
    }
    
    //console.log(hs);
    //console.log(dsI);
   //console.log(dsG);
   //console.log(niv[0][0].nivelE);

   response.render('miFeedback.ejs',
    {
        idSesionado: request.session.idEmpleado,
        rolesA :  request.session.privilegiosPermitidos,
        periodos : pds,
        retroalimentaciones : hs,
        especifico : dsI,
        general : dsG,
        nombreSesion: request.session.nombreSesion,
        apellidoPSesion: request.session.apellidoPSesion,
        foto: request.session.foto,
        nombre_empleado: nom[0][0].nombre,
        apellido_empleado: nom[0][0].apellidoP,
        idEmpleado: empleado,
        nivel_craftpg: niv[0][0].nivelE,
        nivel_peoplepg: niv[0][1].nivelE,
        nivel_businesspg: niv[0][2].nivelE,
        ruta : "/empleados/feedback/"
    });
};


exports.detalleFeedback_id = async (request, response, next) => {
   // console.log("Llegué aquí");
   let evaluador = request.body.IdEval;
   let periodo = request.body.IdPed;
   let evaluado = request.params.idEmpleado;
   let idcraft = request.body.IdCraft;
   let idPeople = request.body.IdPeople;
   let idCommercial = request.body.IdCommercial;

   // console.log(evaluador); console.log(evaluado);
   // console.log(periodo); console.log(idcraft);
   // console.log(idPeople); console.log(idCommercial);

   const rCraft = await Historial.fetchFeedDetallado(idcraft, evaluado, evaluador, periodo); // Retro del Cuestionario Craft.
   const rPeople = await Historial.fetchFeedDetallado(idPeople, evaluado, evaluador, periodo); // Retro del Cuestionario People.
   const rBusiness = await Historial.fetchFeedDetallado(idCommercial, evaluado, evaluador, periodo); // Retro del Cuestionario Business.
   const sol = await Historial.fetchSolicitud(evaluado, evaluador, periodo); // Detalle del Periodo y Evaluador.
   const lvl = await Historial.fetchNiveles(idcraft, idPeople, idCommercial); // Detalle de los niveles al momento de la solicitud.
   const nom = await User.fetchNombre(request.params.idEmpleado);
   
   response.render('detalleFeedback.ejs',
   {
       rolesA :  request.session.privilegiosPermitidos,
       craft : rCraft,
       people : rPeople,
       business : rBusiness,
       solicitud : sol,
       niveles: lvl,
       nombreSesion: request.session.nombreSesion,
       apellidoPSesion: request.session.apellidoPSesion,
       foto: request.session.foto,
       nombre_empleado: nom[0][0].nombre,
       apellido_empleado: nom[0][0].apellidoP,
       id_empleado: request.params.id,
       self: '1',
       ruta : '/miFeedback/:id'
   });
};


exports.cuestionario = (request, response, next) => {
   //Tomo las preguntas del cuestionario de Craft asignardo
   Feed.fecthCuestionarioCraft(request.session.idEmpleado, request.params.idEvaluado, request.params.idPeriodo)
      .then(([preguntasCraft, fieldData]) => {
         request.session.preguntasCraft = preguntasCraft;
         // console.log(preguntasCraft[0]);
         console.log("Nombre: " + preguntasCraft[0].nombre);

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
                     });
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

    console.log(craft);
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

    //console.log(respuestas)

   try {
      //Ciclo for para realizar insert de preguntas y respuestas
      for (i = 0; i < total; i++) {
         let res = new Feed(request.params.idEvaluado, request.session.idEmpleado, idP[i], request.params.idPeriodo, respuestas[i]);
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
         response.render('misMentorados', {
               rolesA: request.session.privilegiosPermitidos,
               rol: request.session.idRol ? request.session.idRol : '',
               // TODO ESTO SE ENVIA A MISMENTORADOS.EJS
               mentorados: rows, // llevar los mentorados
               nombre: request.session.nombreSesion, // sacar su nombre
               correo: request.session.correo, // correo del usurio que esta en header
               // rol: request.session.idRol, // obtener rol del usario
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
               nivel_craftpg: request.session.craft ? request.session.craft : '',
               nivel_peoplepg: request.session.people ? request.session.people : '',
               nivel_businesspg: request.session.business ? request.session.business : '',
            }
         );


      }).catch((error) => {
         console.log(error);
      });
};