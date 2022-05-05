const { response } = require('express');
const PeriodoEvaluacion = require('../models/periodoEvaluacion');
//const Periodo = require('../models/periodo');
const { route } = require('../routes/createPeriodo.routes');
const { execute } = require('../util/database');


// exports.root = (request, response, next) => {
//    // response.render('PeriodosEvaluacion');
//     const info = request.session.info ? request.session.info : '';
//     request.session.info = '';

//     response.render('PeriodosEvaluacion', {
//         info: '',
//         nombreSesion: request.session.nombreSesion,
//         apellidoPSesion: request.session.apellidoPSesion,
//         foto: request.session.foto,
//         rolesA: request.session.privilegiosPermitidos,
//     });
// };

exports.root = async (request, response, next) => {
    // response.render('PeriodosEvaluacion');
    const info = request.session.info ? request.session.info : '';
    request.session.info = '';

    ultimo_periodo = await PeriodoEvaluacion.fetchUP();
    const d = new Date();
    const date = new Date(d);
    let final = ultimo_periodo[0].fecha_final;
    final = new Date(final);
    const gp = date < final;
        
        PeriodoEvaluacion.fetchUltimo()
        .then(([rows, fielData]) => {
            response.render('PeriodosEvaluacion', {
                ultimo_periodo: rows,
                info: '',
                nombreSesion: request.session.nombreSesion,
                apellidoPSesion: request.session.apellidoPSesion,
                foto: request.session.foto,
                rolesA: request.session.privilegiosPermitidos,
                generar_periodo : gp                
            });
        }).catch((error) => {
            console.log(error);
        });
 };

exports.generarPeriodo = (request, response, next) => {
    PeriodoEvaluacion.fetchAll()
        .then(([rows, fielData]) => {
            response.render('ingresarPeriodos', {
                periodo: rows,
                nombreSesion: request.session.nombreSesion,
                apellidoPSesion: request.session.apellidoPSesion,
                foto: request.session.foto,
                rolesA: request.session.privilegiosPermitidos,
            });
        }).catch((error) => {
            console.log(error);
        });
};

exports.generarPeriodoPost = async (request, response, next) => {

    function NombreMes(mes) {
        let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        let nombreMes = meses[mes - 1];
        return nombreMes;
    }

    let anio_periodo = parseInt(String(request.body.inicioFecha).substring(0, 4));
    let mes_inicioPeriodo = parseInt(String(request.body.inicioFecha).substring(5, 7));
    let mes_finPeriodo = parseInt(String(request.body.finFecha).substring(5, 7));

    const nombreMesFinal = NombreMes(mes_finPeriodo);
    const nombreMesInicio = NombreMes(mes_inicioPeriodo);

    let nombre_periodo = nombreMesInicio + '-' + nombreMesFinal;

    const periodoEvaluacion = new PeriodoEvaluacion(nombre_periodo, request.body.inicioFecha, request.body.finFecha, anio_periodo);

    //const periodoEvaluacion = new PeriodoEvaluacion(nombre_periodo, request.body.inicioFecha, request.body.finFecha, Number(anio_periodo));
    periodoEvaluacion.savePeriodo()
        .then(() => {
            response.redirect('/Periodo');
        })
        .catch(err => {
            console.log(err);
        });

};

exports.modificarPeriodo = async (request, response, next) => {
    ultimo_periodo = await PeriodoEvaluacion.fetchUP();
    let i = ultimo_periodo[0].fecha_inicial;

    PeriodoEvaluacion.fetchUltimo()
     .then(([rows, fielData]) => {
         response.render('modificarPeriodos', {
            ultimo_periodo: rows,
            info: '',
            nombreSesion: request.session.nombreSesion,
            apellidoPSesion: request.session.apellidoPSesion,
            foto: request.session.foto,
            rolesA: request.session.privilegiosPermitidos,
            inicial_old: i
        });
     }).catch((error) => {
         console.log(error);
     });
};

exports.modificarPeriodo_post = (request, response, next) => {
    function NombreMes(mes) {
        let meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        let nombreMes = meses[mes - 1];
        return nombreMes;
    }

    let anio_periodo = parseInt(String(request.body.inicioFecha).substring(0, 4));
    let mes_inicioPeriodo = parseInt(String(request.body.inicioFecha).substring(5, 7));
    let mes_finPeriodo = parseInt(String(request.body.finFecha).substring(5, 7));

    const nombreMesFinal = NombreMes(mes_finPeriodo);
    const nombreMesInicio = NombreMes(mes_inicioPeriodo);

    let nombre_periodo = nombreMesInicio + '-' + nombreMesFinal;

    const periodoEvaluacion = new PeriodoEvaluacion(nombre_periodo, request.body.inicioFecha, request.body.finFecha, anio_periodo);

    //const periodoEvaluacion = new PeriodoEvaluacion(nombre_periodo, request.body.inicioFecha, request.body.finFecha, Number(anio_periodo));
    periodoEvaluacion.modifyPeriodo(request.body.id_p)
        .then(() => {
            response.redirect('/Periodo');
        })
        .catch(err => {
            console.log(err);
        });
};

