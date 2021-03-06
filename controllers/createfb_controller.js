const FormatoEvaluacion = require('../models/formatoEvaluacion');
const Dimension = require('../models/dimension');
const Pregunta = require('../models/pregunta');
const Cuestionario = require('../models/Cuestionario');

/* Fetching the data from the database and rendering it to the view. */
exports.root = (request, response, next) => {
   request.session.p = 0;

   const info = request.session.info ? requestfetchPreguta_Cuestionario.session.info : '';
   request.session.info = '';
   FormatoEvaluacion.fetchCuestionarios()
      .then(([rows, fieldData]) => {
         response.render('formatosEvaluacion', {
            info: '',
            nombreSesion: request.session.nombreSesion,
            apellidoPSesion: request.session.apellidoPSesion,
            foto: request.session.foto,
            rolesA: request.session.privilegiosPermitidos,
            cuestionarios: rows,
         });
      }).catch((error) => {
         console.log(error);
      });
};

exports.editarCuestionario = (request, response, next) => {

   Pregunta.findQuestions_nivdim(request.params.nivel, request.params.dim)
      .then(([preguntas_nivdim, fieldData]) => {
         Pregunta.findQuestions_C(request.params.id)
            .then(([preguntas_cuestionario, fieldData]) => {
               response.render('EditarCuestionario', {
                  info: '',
                  nombreSesion: request.session.nombreSesion,
                  apellidoPSesion: request.session.apellidoPSesion,
                  foto: request.session.foto,
                  rolesA: request.session.privilegiosPermitidos,
                  preguntas_nivdim: preguntas_nivdim,
                  preguntas_cuestionario: preguntas_cuestionario,
                  niv: request.params.nivel,
                  dim: request.params.dim,
                  id: request.params.id,
                  nombre: request.params.nombre,
                  p: request.session.p,
               });
            }).catch((error) => {
               console.log(error);
            });
      }).catch((error) => {
         console.log(error);
      });
};

exports.modificarPregunta = (request, response, next) => {

   Pregunta.findQuestions_nivdim(request.params.nivel, request.params.dim)
      .then(([preguntas_nivdim, fieldData]) => {
         Pregunta.findQuestions_C(request.params.id)
            .then(([preguntas_cuestionario, fieldData]) => {
               response.render('ModificarPregunta', {
                  info: '',
                  nombreSesion: request.session.nombreSesion,
                  apellidoPSesion: request.session.apellidoPSesion,
                  foto: request.session.foto,
                  rolesA: request.session.privilegiosPermitidos,
                  preguntas_nivdim: preguntas_nivdim,
                  preguntas_cuestionario: preguntas_cuestionario,
                  niv: request.params.nivel,
                  dim: request.params.dim,
                  id: request.params.id,
                  nombre: request.params.nombre,
                  p: request.session.p,
               });
            }).catch((error) => {
               console.log(error);
            });
      }).catch((error) => {
         console.log(error);
      });
};

exports.editarCuestionario_post = (request, response, next) => {
   const formatoEvaluacion = new FormatoEvaluacion(request.params.nombre, request.params.dim, request.params.nivel);
   formatoEvaluacion.saveCuestionario()
      .then(() => {
         FormatoEvaluacion.savePreguntasCuestionario(JSON.parse(request.body.hid), request.params.id)
            .then(() => {
               response.redirect('/feedback');
            })
            .catch(err => {
               console.log(err);
            });
      })
      .catch(err => {
         console.log(err);
      });
};

exports.verCuestionario = (request, response, next) => {

   Cuestionario.fetchPreguta_Cuestionario(request.params.id)
      .then(([preguntas_cuest, fieldData]) => {
         //console.log(preguntas_cuest);
         Cuestionario.Dimension_Nombre(request.params.id)
            .then(([nombre_cuest, fieldData]) => {
               response.render('verCuestionario', {
                  preguntas: preguntas_cuest,
                  nombreDimension: nombre_cuest,
                  nombre_cuestinario: request.params.nomCues,
                  info: '',
                  nombreSesion: request.session.nombreSesion,
                  apellidoPSesion: request.session.apellidoPSesion,
                  foto: request.session.foto,
                  rolesA: request.session.privilegiosPermitidos,
               });

            });
      }).catch(err => {
         console.log(err);
      });


};

exports.generarFormato = (request, response, next) => {

   //request.session.pr = 0;

   Dimension.fetchAll()
      .then(([rows, fieldData]) => {
         response.render('generarFormatos', {
            dimensiones: rows,
            nombreSesion: request.session.nombreSesion,
            apellidoPSesion: request.session.apellidoPSesion,
            foto: request.session.foto,
            nombreC: "",
            dimC: "",
            nivelC: "",
            pregunta0_p: "",
            pregunta1_p: "",
            pregunta2_p: "",
            rolesA: request.session.privilegiosPermitidos,
            //pr: request.session.pr
         });
      }).catch((error) => {
         console.log(error);
      });
};

exports.generarFormato_post = (request, response, next) => {

   //console.log("Controlador:");
   //console.log(request.body);
   request.session.info = 'El cuestionario "' + request.body.nombreCuestionario + '" fue registrado con ??xito';
   const formatoEvaluacion = new FormatoEvaluacion(request.body.nombreCuestionario, request.body.inputDimension, request.body.inputNivel);
   formatoEvaluacion.saveCuestionario()
      .then(() => {
         FormatoEvaluacion.fetchCuestionarios()
            .then(([rows, fieldData]) => {
               response.render('formatosEvaluacion', {
                  info: '',
                  nombreSesion: request.session.nombreSesion,
                  apellidoPSesion: request.session.apellidoPSesion,
                  foto: request.session.foto,
                  rolesA: request.session.privilegiosPermitidos,
                  cuestionarios: rows,
               });
            }).catch((error) => {
               console.log(error);
            });
      })
      .catch(err => {
         console.log(err);
      });
   //response.render('generarFormatos', {
   //});
};


exports.crearPregunta = (request, response, next) => {
   response.render('crearPregunta', {
      info: '',
      nombreSesion: request.session.nombreSesion,
      apellidoPSesion: request.session.apellidoPSesion,
      foto: request.session.foto,
      rolesA: request.session.privilegiosPermitidos,
      niv: request.params.nivel,
      dim: request.params.dim,
      id: request.params.id,
      nombre: request.params.nombre,
   });
};

exports.crearPregunta_post = (request, response, next) => {
   let url = '/feedback/editarCuestionario/' + request.params.id + '/' + request.params.nivel + '/' + request.params.dim + '/' + request.params.nombre;
   request.session.p = 1;

   const pregunta = new Pregunta(request.body.textoPregunta, request.params.nivel, request.params.dim, request.body.inputTipo);
   pregunta.savePregunta()
      .then(() => {
         response.redirect(url);
      })
      .catch(err => {
         console.log(err);
      });

};