const { request, response } = require('express');
const Periodo = require('../models/periodo');
const periodoEvaluacion = require('../models/periodo');
const { route } = require('../routes/periodo.routes');

exports.generarPeriodo=(request,response,next)=>{
    Periodo.fetchAll()
    .then(([rows, fielData]) => {
        response.render('generarPeriodo', {
            Periodos: rows // DUDADUDODSA
        });
    }).catch((error) => {
        console.log(error);
    });
};


exports.root = (request, response, next) => {
    response.render('generarPeriodos');
};





