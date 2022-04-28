const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class Pregunta {

    //Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(nueva_tPregunta, nuevo_nivelP, nuevo_dimP, nuevo_tipo) {
        this.tPregunta = nueva_tPregunta;
        this.nivelP = nuevo_nivelP;
        this.dimP = nuevo_dimP;
        this.tipo = nuevo_tipo;
    }

    savePregunta() {
        return db.execute('INSERT INTO pregunta(pregunta, nivelP, idDimension, idTipo) VALUES(?,?,?,?);',
            [this.tPregunta, this.nivelP, this.dimP, this.tipo]);
    }

    static findQuestions_nivdim(nivelP, dimP) {
        return db.execute('SELECT idPregunta, idTipo, pregunta FROM pregunta WHERE nivelP=? AND idDimension=?',
            [nivelP, dimP]);
    }

    static findQuestions_C(nivelC) { 
        return db.execute('SELECT P.idPregunta, idTipo, pregunta FROM pregunta P, preguntacuestionario PC, cuestionario C WHERE P.idPregunta = PC.idPregunta and C.idCuestionario = PC.idCuestionario AND C.idCuestionario = ?',
            [nivelC]);
    }

};