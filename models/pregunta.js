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

    static findQuestions(nivelP, dimP) {
        return db.execute('SELECT * FROM pregunta WHERE nivelP=? AND idDimension=?',
            [nivelP, dimP]);
    }

};