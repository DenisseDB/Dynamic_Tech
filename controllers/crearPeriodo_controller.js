const PeriodoEvaluacion = require('../models/periodoEvaluacion');
//const Periodo = require('../models/periodo');
const { route } = require('../routes/createPeriodo.routes');
const { execute } = require('../util/database');

exports.root = (request, response, next) => {
   // response.render('PeriodosEvaluacion');
    const info = request.session.info ? request.session.info : '';
    request.session.info = '';

    response.render('PeriodosEvaluacion', {
        info: '',
        nombreSesion: request.session.nombreSesion,
        apellidoPSesion: request.session.apellidoPSesion,
        foto: request.session.foto,
        rolesA: request.session.privilegiosPermitidos,
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

exports.generarPeriodoPost = (request, response, next) => {

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
            response.render('PeriodosEvaluacion',{
                info: request.session.info,
                nombreSesion: request.session.nombreSesion,
                apellidoPSesion: request.session.apellidoPSesion,
                foto: request.session.foto,
                rolesA: request.session.privilegiosPermitidos,
            });
        })
        .catch(err => {
            console.log(err);
        });

};

