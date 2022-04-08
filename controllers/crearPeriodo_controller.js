const periodoEvaluacion = require('../models/periodoEvaluacion');
//const Periodo = require('../models/periodo');
const Pregunta = require('../models/pregunta');
const { route } = require('../routes/createPeriodo.routes');
const { execute } = require('../util/database');

exports.root = (request, response, next) => {
    response.render('PeriodosEvaluacion');
};




exports.generarPeriodo = (request, response, next) => {
        return periodoEvaluacion.fetchAll()
        .then(([rows, fielData]) => {
            response.render('ingresarPeriodos', {
                periodo: rows
           });
        }).catch((error) => {
            console.log(error);
        });
};

exports.generarPeriodoPost = (request, response, next) => {

    console.log("Si se genera el post");

    let anio_periodo = parseInt(String(request.body.fecha_inicial).substring(0,4 ));
    let mes_inicioPeriodo = parseInt(String(request.body.fecha_final).substring(5,7));
    let mes_finPeriodo = parseInt(String(request.body.fecha_inicial).substring(5,7));



    const nombreMesFinal= NombreMes(mes_finPeriodo);
    const nombreMesInicio= NombreMes(mes_inicioPeriodo);

    let nombre_periodo = nombreMesInicio + ' ' + nombreMesFinal;



    const periodoEvaluacion = new periodoEvaluacion(nombre_periodo, request.body.fecha_inicial, request.body.fecha_inicial, anio_periodo);
    periodoEvaluacion.savePeriodo()
        .then(() => {
                    response.render('PeriodosEvaluacion');
                })
        .catch(err => {
            console.log(err);
        });

    console.log("Post creado");
};

