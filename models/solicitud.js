const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class Solicitud{

    //Constructor de la clase.
    //constructor() {}

    // Método. Selección de compañero(s) - Excluyendo al sesionado.
    static fecthEmpleados(idSesionado) {
        return db.execute('SELECT idEmpleado, nombre, apellidoP FROM empleado WHERE idEmpleado <> ?;', [idSesionado]);
    }

    // Método. Solicitudes del sesionado - (Retroalimentación).
    static fecthSolicitudes(idSesionado) {
        return db.execute('SELECT idEvaluado, idEvaluador, nombre, apellidoP, idPeriodo, estatus FROM retroalimentacion R, empleado E WHERE R.idEvaluador = E.idEmpleado AND idPeriodo in (SELECT MAX(idPeriodo) FROM periodo) AND R.idEvaluado = ?;', [idSesionado]);
    }
}