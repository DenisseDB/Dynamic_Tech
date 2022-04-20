const FormatoEvaluacion = require('../models/formatoEvaluacion');
const Dimension = require('../models/dimension');
const Pregunta = require('../models/pregunta');
const Cuestionario = require('../models/Cuestionario');

exports.root = (request, response, next) => {

    const info = request.session.info ? request.session.info : '';
    request.session.info = '';

    response.render('formatosEvaluacion', {
        info: '',
        nombreSesion: request.session.nombreSesion,
        apellidoPSesion: request.session.apellidoPSesion,
        foto: request.session.foto,
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
                foto: request.session.foto,
                nombreC: "",
                dimC: "",
                nivelC: "",
                pregunta0_p: "",
                pregunta1_p: "",
                pregunta2_p: "",
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
                        foto: request.session.foto,
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

exports.crearPregunta1 = (request, response, next) => {
    response.render('crearPregunta', {
        nivelP: request.params.nivel,
        dimP: request.params.dim,
        nombreC: request.params.nombre,
        pregunta0: "",
        pregunta1: "",
        pregunta2: "",
        nombreSesion: request.session.nombreSesion,
        apellidoPSesion: request.session.apellidoPSesion,
        foto: request.session.foto,
    });
};

exports.crearPregunta2 = (request, response, next) => {
    response.render('crearPregunta', {
        nivelP: request.params.nivel,
        dimP: request.params.dim,
        nombreC: request.params.nombre,
        pregunta0: request.params.pregunta0,
        pregunta1: "",
        pregunta2: "",
        nombreSesion: request.session.nombreSesion,
        apellidoPSesion: request.session.apellidoPSesion,
        foto: request.session.foto,
    });
};

exports.crearPregunta3 = (request, response, next) => {
    response.render('crearPregunta', {
        nivelP: request.params.nivel,
        dimP: request.params.dim,
        nombreC: request.params.nombre,
        pregunta0: request.params.pregunta0,
        pregunta1: request.params.pregunta1,
        pregunta2: "",
        nombreSesion: request.session.nombreSesion,
        apellidoPSesion: request.session.apellidoPSesion,
        foto: request.session.foto,
    });
};

exports.crearPregunta4 = (request, response, next) => {
    response.render('crearPregunta', {
        nivelP: request.params.nivel,
        dimP: request.params.dim,
        nombreC: request.params.nombre,
        pregunta0: request.params.pregunta0,
        pregunta1: request.params.pregunta1,
        pregunta2: request.params.pregunta2,
        nombreSesion: request.session.nombreSesion,
        apellidoPSesion: request.session.apellidoPSesion,
        foto: request.session.foto,
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
            Dimension.fetchAll()
                .then(([rows, fieldData]) => {
                    response.render('generarFormatos', {
                        dimensiones: rows,
                        nombreSesion: request.session.nombreSesion,
                        apellidoPSesion: request.session.apellidoPSesion,
                        nombreC: request.body.nombreC,
                        dimC: request.body.dimPr,
                        nivelC: request.body.nivelPr,
                        pregunta0_p: request.body.pregunta0,
                        pregunta1_p: request.body.pregunta1,
                        pregunta2_p: request.body.pregunta2,
                        foto: request.session.foto,
                    });
                }).catch((error) => {
                    console.log(error);
                });
        })
        .catch(err => {
            console.log(err);
        });
};


exports.modificarFormato = (request, response, next) => {

    Cuestionario.fetchDimension()
        .then(([dimension, fielData]) => {
            response.render('modificarFormato', {
                dimensiones: dimension,
                nombreSesion: request.session.nombreSesion,
                apellidoPSesion: request.session.apellidoPSesion,
                foto: request.session.foto,
            });
        }).catch((error) => {
            console.log(error);
        });



};




exports.modificarFormato_post = (request, response, next) => {

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



exports.buscarCuestionario = (request, response, next) => {
    console.log(request.params.nivel);
    console.log(request.params.dim);
    console.log('buscar_cuestionario');
    Cuestionario.findCuestionario(request.params.dim, request.params.nivel)
        .then(([rows, fieldData]) => {
            console.log(rows);
            response.status(200).json(rows);
        })
        .catch(err => {
            console.log(err);
        });
};


exports.buscarPregunta = (request, response, next) => {
    console.log(request.params.nivel);
    console.log(request.params.dim);
    console.log('buscar_Pregunta');
    Cuestionario.findQuestions(request.params.nivel, request.params.dim)
        .then(([rows, fieldData]) => {
            console.log(rows);
            response.status(200).json(rows);
        })
        .catch(err => {
            console.log(err);
        });
};
