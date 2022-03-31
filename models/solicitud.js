const db = require('../util/database');

module.exports = class Solicitud{

    //Constructor de la clase.
    constructor(idSesionado, Evaluador, CCraft, CPeople, CBusiness, Periodo, Sfecha) {
        this.idEvaluado = idSesionado;
        this.idEvaluador = Evaluador;
        this.idCuestionarioCraft = CCraft;
        this.idCuestionarioPeople = CPeople;
        this.idCuestionarioBusiness = CBusiness;
        this.idPeriodo = Periodo;
        this.fecha = Sfecha;
    }

    // Método. Nueva solicitud de feedback (hecha por el sesionado).
    save() {
        return db.execute(
            'INSERT INTO retroalimentacion(idEvaluado,idEvaluador,idCuestionarioCraft,idCuestionarioPeople,idCuestionarioBusiness,idPeriodo,fecha) VALUES(?,?,?,?,?,?,?)',
            [this.idEvaluado, this.idEvaluador, this.idCuestionarioCraft, 
                this.idCuestionarioPeople, this.idCuestionarioBusiness, this.idPeriodo, this.fecha]); 
    }

    // Método. Cuestionarios del sesionado dados sus niveles de cada dimensión.
    static fecthIDCuestionarios(nivelCraft, nivelPeople, nivelBusiness) {
        return db.execute(
            '(SELECT C.idCuestionario FROM dimension D, pregunta P, preguntacuestionario PC, cuestionario C WHERE P.idDimension = D.idDimension AND P.idPregunta = PC.idPregunta AND PC.idCuestionario = C.idCuestionario AND D.idDimension = 1 AND P.nivelP = ? ORDER BY fecha DESC LIMIT 1) UNION (SELECT C.idCuestionario FROM dimension D, pregunta P, preguntacuestionario PC, cuestionario C WHERE P.idDimension = D.idDimension AND P.idPregunta = PC.idPregunta AND PC.idCuestionario = C.idCuestionario AND D.idDimension = 2 AND P.nivelP = ? ORDER BY fecha DESC LIMIT 1) UNION (SELECT C.idCuestionario FROM dimension D, pregunta P, preguntacuestionario PC, cuestionario C WHERE P.idDimension = D.idDimension AND P.idPregunta = PC.idPregunta AND PC.idCuestionario = C.idCuestionario AND D.idDimension = 3 AND P.nivelP = ? ORDER BY fecha DESC LIMIT 1)', 
            [Math.floor(nivelCraft), Math.floor(nivelPeople), Math.floor(nivelBusiness)]);
    }

    // Método. Selección de compañero(s) para solicitud.
    static fecthEmpleados(idSesionado) {
        return db.execute('SELECT idEmpleado, nombre, apellidoP FROM empleado WHERE idEmpleado <> ?;', [idSesionado]);
    }
    
    // Método. Obtención del ID del compañero por su nombre.
    static fecthOneID(Evaluador) {
        const nombre = Evaluador.split(" ");
        return db.execute('SELECT idEmpleado FROM empleado WHERE nombre LIKE ? AND apellidoP LIKE ?;', [nombre[0] + '%', nombre[1] + '%']);
    }

    // Método. Solicitudes hechas por el sesionado. - Mis Solicitudes
    static fecthSolicitudes(idSesionado) {
        return db.execute('SELECT idEvaluado, idEvaluador, nombre, apellidoP, idPeriodo, estatus FROM retroalimentacion R, empleado E WHERE R.idEvaluador = E.idEmpleado AND idPeriodo in (SELECT MAX(idPeriodo) FROM periodo) AND R.idEvaluado = ?;', [idSesionado]);
    }

    // Método. Solicitudes hechas al sesionado. - A evaluar
    static fecthEvaluaciones(idSesionado) {
        return db.execute('SELECT nombre, apellidoP, R.idEvaluado, estatus, NombrePeriodo, P.idPeriodo, fecha_inicial, fecha_final FROM empleado E, retroalimentacion R, periodo P WHERE E.idEmpleado = R.idEvaluado AND P.idPeriodo = R.idPeriodo AND R.idEvaluador = ? AND P.idPeriodo in (SELECT MAX(idPeriodo) FROM periodo);',
            [idSesionado]);
    }
    
}