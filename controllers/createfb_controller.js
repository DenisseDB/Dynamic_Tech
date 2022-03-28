const formatoEvaluacion = require('../models/formatoEvaluacion');
const Dimension = require('../models/dimension');
const { route } = require('../routes/createfb.routes');

exports.root = (request, response, next) => {
    response.render('formatosEvaluacion');
};

exports.generarFormato = (request, response, next) => {
    Dimension.fetchAll()
    .then(([rows,fielData])=>{
        response.render('generarFormatos', {
            dimensiones: rows
        });
    }).catch((error)=>{
        console.log(error);
    });
    /*response.render('generarFormatos', {
    });*/
};