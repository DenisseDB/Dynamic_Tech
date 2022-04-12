const FormatoEvaluacion = require('../models/formatoEvaluacion');
const Dimension = require('../models/dimension');
const Pregunta = require('../models/pregunta');

exports.root = (request, response, next) => {
    response.render('formatosEvaluacion');
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
}

exports.generarFormato = (request, response, next) => {
    Dimension.fetchAll()
        .then(([rows, fielData]) => {
            response.render('generarFormatos', {
                dimensiones: rows
            });
        }).catch((error) => {
            console.log(error);
        });
};

exports.generarFormato_post = (request, response, next) => {

    //console.log("Controlador:");
    //console.log(request.body);
    let preguntas = [request.body.pregunta0, request.body.pregunta1];
    const formatoEvaluacion = new FormatoEvaluacion(request.body.nombreCuestionario, request.body.inputDimension, request.body.inputNivel, preguntas);
    formatoEvaluacion.saveCuestionario()
        .then(() => {
            formatoEvaluacion.savePreguntasCuestionario()
                .then(() => {
                    response.render('formatosEvaluacion');
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
        dimP: request.params.dim
    });
};

exports.crearPregunta_post = (request, response, next) => {
    console.log(request.body.textoPregunta);
    console.log(request.body.nivelPr);
    console.log(request.body.dimPr);
    console.log(request.body.inputTipo);
    const pregunta = new Pregunta(request.body.textoPregunta, request.body.nivelPr, request.body.dimPr, request.body.inputTipo);
    pregunta.savePregunta()
        .then(() => {
            response.redirect(request.body.referer);
        })
        .catch(err => {
            console.log(err);
        });
    //response.redirect('/feedback/generarFormato');
};
