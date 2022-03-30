const formatoEvaluacion = require('../models/formatoEvaluacion');
const Dimension = require('../models/dimension');
const Pregunta = require('../models/pregunta');
const { route } = require('../routes/createfb.routes');

exports.root = (request, response, next) => {
    response.render('formatosEvaluacion');
};



/*exports.generarFormato = (request, response, next) => {
    Dimension.fetchAll()
    .then(([rows1,fielData])=>{
        Pregunta.findQuestions(request.body.inputGroupSelect02, request.body.inputGroupSelect01)
        .then(([rows2,fielData])=>{
            response.render('generarFormatos', {
                dimensiones: rows1,
                preguntas: rows2

            });
        }).catch((error)=>{
            console.log(error);
        });
    }).catch((error)=>{
        console.log(error);
    });*/


exports.buscarFormato = (request, response, next) => {
    console.log(request.params.nivel);
    console.log(request.params.dim);
    console.log('buscar');
    Pregunta.findQuestions(request.params.nivel, request.params.dim)
        .then(([rows, fieldData]) => {
            console.log(rows);
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

    /*response.render('generarFormatos', {
    });*/
};