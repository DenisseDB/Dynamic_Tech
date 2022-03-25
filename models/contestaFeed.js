const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class Feedback {

    //Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(Evalaudo,Evaluador,CuestionarioNivel,Periodo,nomPeriodo,idPregunta,pregunta,estatus) {
        this.idEvaluado = Evaluado;
        this.idEvaluador = Evaluador;
        this.idCuestionario = CuestionarioNivel;
        this.idPeriodo = Periodo;
        this.NombrePeriodo = nomPeriodo;
        this.idPregunta = idPregunta;
        this.pregunta = pregunta;
        this.estatus = estatus
    }

    // //Este método servirá para guardar de manera persistente el nuevo objeto. 
    save() {
        return db.execute('INSERT INTO retroalimentacion (idEvaluado, idEvaluador,idCuestionario,idPeriodo) VALUES (?, ?,?,?)',
        [this.idEvaluado, this.idEvaluador,this.idCuestionario,this.idEvaluador]
    );
    }

    static fecthSolFeedback(idEvaluador) {
        return db.execute('SELECT nombre, apellidoP, apellidoM, idEvaluado,estatus FROM empleado, retroalimentacion WHERE empleado.idEmpleado = retroalimentacion.idEvaluado and idEvaluador = ?;',
            [idEvaluador]);

    }

    //Este método nos devuelve el nombre del periodo más reciente
    static findPeriodo() {
        return db.execute('SELECT idPeriodo,  NombrePeriodo FROM periodo ORDER by fecha_inicial DESC LIMIT 1;');
    }

    static fecthCuestionario(idEvaluador,idEvaluado) {
        var cuestionario =  db.execute('SELECT p.idPregunta, p.pregunta FROM retroalimentacion r, preguntacuestionario pc , pregunta p WHERE r.idCuestionario = pc.idCuestionario and pc.idPregunta = p.idPregunta and r.idPeriodo = 12 and r.idEvaluador = ? and r.idEvaluado = 2 ORDER BY estatus asc;',
        [idEvaluador]);
        // [idEvaluador,idEvaluado]);
        return cuestionario

    }



}