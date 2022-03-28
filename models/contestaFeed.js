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
        return db.execute('SELECT nombre, apellidoP, apellidoM, r.idEvaluado,estatus, NombrePeriodo, p.idPeriodo FROM empleado e, retroalimentacion r ,periodo p WHERE e.idEmpleado = r.idEvaluado and p.idPeriodo = r.idPeriodo and r.idEvaluador = ? and p.idPeriodo in (SELECT MAX(idPeriodo) FROM periodo);',
            [idEvaluador]);

        // return db.execute('SELECT nombre, apellidoP, apellidoM, idEvaluado,estatus FROM empleado, retroalimentacion WHERE empleado.idEmpleado = retroalimentacion.idEvaluado and idEvaluador = ? and idPeriodo = ?;',
        //     [idEvaluador,idPeriodo]);

    }

    static fecthCuestionario(idEvaluador,idEvaluado,idPeriodo) {
        var cuestionario =  db.execute('SELECT p.idPregunta, p.pregunta FROM retroalimentacion r, preguntacuestionario pc , pregunta p WHERE (r.idCuestionarioCraft = pc.idCuestionario or r.idCuestionarioPeople = pc.idCuestionario or r.idCuestionarioBusiness = pc.idCuestionario ) and pc.idPregunta = p.idPregunta and r.idEvaluador = ? and r.idEvaluado = ? and r.idPeriodo = ? ORDER BY estatus asc;',
        [idEvaluador, idEvaluado, idPeriodo]);
        return cuestionario

    }

    // static fecthCuestionario(idEvaluador,idEvaluado,idPeriodo) {
    //     var cuestionario =  db.execute('SELECT p.idPregunta, p.pregunta FROM retroalimentacion r, preguntacuestionario pc , pregunta p WHERE (r.idCuestionarioCraft = pc.idCuestionario or r.idCuestionarioPeople = pc.idCuestionario or r.idCuestionarioBusiness = pc.idCuestionario ) and pc.idPregunta = p.idPregunta and r.idEvaluador = ? and r.idEvaluado = ?  and r.idPeriodo = ? ORDER BY estatus asc;',
    //     [idEvaluador, idEvaluado,idPeriodo]);
    //     // [idPeriodo,idEvaluador,idEvaluado]);
    //     return cuestionario

    // }



}