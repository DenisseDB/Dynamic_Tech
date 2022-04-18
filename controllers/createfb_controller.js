const FormatoEvaluacion = require('../models/formatoEvaluacion');
const Dimension = require('../models/dimension');
const Pregunta = require('../models/pregunta');

exports.root = (request, response, next) => {

    const info = request.session.info ? request.session.info : '';
    request.session.info = '';

    response.render('formatosEvaluacion', {
        info: '',
        nombreSesion: request.session.nombreSesion,
        apellidoPSesion: request.session.apellidoPSesion,
    });
};

exports.buscarFormato = (request, response, next) => {
    //console.log(request.params.nivel);
    //console.log(request.params.dim);
    //console.log(request.body);
    //console.log('buscar');
    Pregunta.findQuestions(request.params.nivel, request.params.dim)
        .then(([rows, fieldData]) => {
            //console.log(rows);
            response.status(200).json(rows);
        })
        .catch(err => {
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
                //pr: request.session.pr
            });
        }).catch((error) => {
            console.log(error);
        });
};

exports.generarFormato_post = (request, response, next) => {

    //console.log("Controlador:");
    //console.log(request.body);
    request.session.info = 'El cuestionario "' + request.body.nombreCuestionario + '" fue registrado con éxito';
    let preguntas = [request.body.pregunta0, request.body.pregunta1, request.body.pregunta2];
    const formatoEvaluacion = new FormatoEvaluacion(request.body.nombreCuestionario, request.body.inputDimension, request.body.inputNivel, preguntas);
    formatoEvaluacion.saveCuestionario()
        .then(() => {
            formatoEvaluacion.savePreguntasCuestionario()
                .then(() => {
                    response.render('formatosEvaluacion', {
                        info: request.session.info,
                        nombreSesion: request.session.nombreSesion,
                        apellidoPSesion: request.session.apellidoPSesion,
                    });
                })
                .catch(err => {
                    console.log(err);
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
        referer: request.headers.referer,
        nivelP: request.params.nivel,
        dimP: request.params.dim,
        nombreSesion: request.session.nombreSesion,
        apellidoPSesion: request.session.apellidoPSesion,
    });
};

exports.crearPregunta_post = (request, response, next) => {
    /*console.log('ab');
    console.log(request.body.textoPregunta);
    console.log(request.body.nivelPr);
    console.log(request.body.dimPr);
    console.log(request.body.inputTipo);*/

    const pregunta = new Pregunta(request.body.textoPregunta, request.body.nivelPr, request.body.dimPr, request.body.inputTipo);
    pregunta.savePregunta()
        .then(() => {
            console.log('guardar pregunta');
            response.status(304);
        })
        .catch(err => {
            console.log(err);
        });
};
