const db = require('../util/database');

module.exports = class Historial{

    // Método. Periodos de evaluación previos y actual.
    static fecthAllPeriodo() {
        return db.execute('SELECT * FROM periodo ORDER BY idPeriodo DESC;')
            .then(([rows, fielData]) => {
                return rows;
            })
            .catch((error) => {
                console.log(error);
                return 0;
            });
    }

    // Método. Solicitudes respondidas históricamente.
    static fecthFeedHistorico(idSesionado) {
        return db.execute('SELECT idEvaluador, nombre, apellidoP, idCuestionarioCraft, idCuestionarioPeople, idCuestionarioBusiness, idPeriodo FROM retroalimentacion R, empleado E WHERE R.idEvaluador = E.idEmpleado AND idEvaluado = ? AND estatus = 1 ORDER BY idPeriodo DESC;', 
        [idSesionado])
            .then(([rows, fielData]) => {
                return rows;
            })
            .catch((error) => {
                console.log(error);
                return 0;
            });    
    }
}