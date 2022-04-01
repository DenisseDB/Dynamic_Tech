const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class Feedback {

    //Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(Evaluado,Evaluador,Pregunta, Periodo,respuesta) {
        this.idEvaluado = Evaluado;
        this.idEvaluador = Evaluador;
        this.idPregunta = Pregunta;
        this.idPeriodo = Periodo;
        this.respuesta = respuesta
    }

    // //Este método servirá para guardar de manera persistente el nuevo objeto. 
    save() {
       ;
        //Llamo a un procedue que a la vez es una transacción
        /* Lo que hace es realizar un insert de una pregunta-respuesta y cambia el
        estatus de respondida a true */
        return db.execute('CALL registrarFeedback (?,?,?,?,?)',
        [this.idEvaluado, this.idEvaluador,this.idPregunta,this.idPeriodo,this.respuesta] );
    }

    //Para obtener las preguntas de craft asignadas a un evaluado
       static fecthCuestionarioCraft(idEvaluador,idEvaluado,idPeriodo) {
        var cuestionario =  db.execute('SELECT p.idPregunta, p.pregunta, e.nombre, e.apellidoP, e.apellidoM FROM retroalimentacion r, preguntacuestionario pc , pregunta p, empleado e WHERE (r.idCuestionarioCraft = pc.idCuestionario) and e.idEmpleado = r.idEvaluado and pc.idPregunta = p.idPregunta and r.idEvaluador = ? and r.idEvaluado = ? and r.idPeriodo = ? ORDER BY estatus asc;',
        [idEvaluador, idEvaluado, idPeriodo]);
        return cuestionario

    }

     //Para obtener las preguntas de people asignadas a un evaluado
    static fecthCuestionarioPeople(idEvaluador,idEvaluado,idPeriodo) {
        var cuestionario =  db.execute('SELECT p.idPregunta, p.pregunta, e.nombre, e.apellidoP, e.apellidoM FROM retroalimentacion r, preguntacuestionario pc , pregunta p, empleado e WHERE (r.idCuestionarioPeople = pc.idCuestionario) and e.idEmpleado = r.idEvaluado and pc.idPregunta = p.idPregunta and r.idEvaluador = ? and r.idEvaluado = ? and r.idPeriodo = ? ORDER BY estatus asc;',
        [idEvaluador, idEvaluado, idPeriodo]);
        return cuestionario

    }

     //Para obtener las preguntas de business asignadas a un evaluado
    static fecthCuestionarioBusiness(idEvaluador,idEvaluado,idPeriodo) {
        var cuestionario =  db.execute('SELECT p.idPregunta, p.pregunta, e.nombre, e.apellidoP, e.apellidoM FROM retroalimentacion r, preguntacuestionario pc , pregunta p, empleado e WHERE (r.idCuestionarioBusiness = pc.idCuestionario) and e.idEmpleado = r.idEvaluado and pc.idPregunta = p.idPregunta and r.idEvaluador = ? and r.idEvaluado = ? and r.idPeriodo = ? ORDER BY estatus asc;',
        [idEvaluador, idEvaluado, idPeriodo]);
        return cuestionario

    }


}