const db = require('../util/database');

module.exports = class Historial{

    // Método. Periodos de evaluación previos y actual.
    static fetchAllPeriodo() {
        return db.execute('SELECT * FROM periodo ORDER BY idPeriodo DESC LIMIT 12;')
            .then(([rows, fielData]) => {
                return rows;
            })
            .catch((error) => {
                console.log(error);
                return 0;
            });
    }

    // Método. Solicitudes respondidas históricamente.
    static fetchFeedHistorico(idSesionado) {
        return db.execute('SELECT idEvaluador, fotoPerfil, nombre, apellidoP, idCuestionarioCraft, idCuestionarioPeople, idCuestionarioBusiness, idPeriodo FROM retroalimentacion R, empleado E WHERE R.idEvaluador = E.idEmpleado AND idEvaluado = ? AND estatus = 1 ORDER BY idPeriodo DESC, idEvaluador ASC;', 
        [idSesionado])
            .then(([rows, fielData]) => {
                return rows;
            })
            .catch((error) => {
                console.log(error);
                return 0;
            });    
    }

    // Método. Detalle de una solicitud.
    static fetchSolicitud(idEvaluado, idEvaluador, idPeriodo) {
        return db.execute('SELECT nombre, apellidoP, NombrePeriodo, anio FROM retroalimentacion R, empleado E, periodo P WHERE R.idEvaluador = E.idEmpleado AND R.idPeriodo = P.idPeriodo AND idEvaluado = ? AND idEvaluador = ? AND R.idPeriodo = ?;', 
        [idEvaluado, idEvaluador, idPeriodo])
            .then(([rows, fielData]) => {
                return rows;
            })
            .catch((error) => {
                console.log(error);
                return 0;
            });    
    }

    // Método. Detalle de los niveles de cuestionario de una solicitud.
    static fetchNiveles(idCraft, idPeople, idCommercial) {
        return db.execute('(SELECT idCuestionario, nivelP, idDimension FROM preguntacuestionario PC, pregunta P WHERE PC.idPregunta = P.idPregunta AND idCuestionario = ? LIMIT 1) UNION (SELECT idCuestionario, nivelP, idDimension FROM preguntacuestionario PC, pregunta P WHERE PC.idPregunta = P.idPregunta AND idCuestionario = ? LIMIT 1) UNION (SELECT idCuestionario, nivelP, idDimension FROM preguntacuestionario PC, pregunta P WHERE PC.idPregunta = P.idPregunta AND idCuestionario = ? LIMIT 1);', 
        [idCraft, idPeople, idCommercial])
            .then(([rows, fielData]) => {
                return rows;
            })
            .catch((error) => {
                console.log(error);
                return 0;
            });    
    }

    // Método. Preguntas y respuesta de un cuestionario.
    static fetchFeedDetallado(idCuestionario, idEvaluado, idEvaluador, idPeriodo) {
        return db.execute('SELECT PC.idPregunta, idTipo, pregunta, respuesta FROM preguntacuestionario PC, pregunta P, respondesolicita R WHERE idCuestionario = ? AND PC.idPregunta = P.idPregunta AND idEvaluado = ? AND idEvaluador = ? and idPeriodo = ? and PC.idPregunta = R.idPregunta ORDER BY fechaInclusion DESC;', 
        [idCuestionario, idEvaluado, idEvaluador, idPeriodo])
            .then(([rows, fielData]) => {
                return rows;
            })
            .catch((error) => {
                console.log(error);
                return 0;
            });    
    }

    // Método. Desempeño según feedback de compañero en un periodo.
    static fetchDesempenioE(iCraft, iPeople, iCommercial, idEvaluado, idEvaluador, idPeriodo) {
        return db.execute("SELECT idDimension, idPeriodo, AVG(respuesta) as 'promedio' FROM preguntacuestionario PC, pregunta P, respondesolicita R WHERE (idCuestionario = ? OR idCuestionario = ? OR idCuestionario = ?) AND PC.idPregunta = P.idPregunta AND idEvaluado = ? AND idEvaluador = ? and idPeriodo = ? and PC.idPregunta = R.idPregunta AND idTipo = 1 GROUP BY idCuestionario ORDER BY idDimension ASC;",
        [iCraft, iPeople, iCommercial, idEvaluado, idEvaluador, idPeriodo])
            .then(([rows, fielData]) => {
                return rows;
            })
            .catch((error) => {
                console.log(error);
                return 0;
            });    
    }

    // Método. Desempeño por periodo.
    static fetchDesempenioG(idEvaluado) {
        return db.execute("SELECT idPeriodo, idDimension, AVG(respuesta) as 'promedio' FROM preguntacuestionario PC, pregunta P, respondesolicita R WHERE PC.idPregunta = P.idPregunta AND idEvaluado = ? and PC.idPregunta = R.idPregunta AND idTipo = 1 GROUP BY idCuestionario, idPeriodo ORDER BY idPeriodo DESC, idDimension ASC;",
        [idEvaluado])
            .then(([rows, fielData]) => {
                return rows;
            })
            .catch((error) => {
                console.log(error);
                return 0;
            });    
    }
}