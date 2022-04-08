const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class  periodoEvaluacion {

    constructor(nuevo_nombre, nueva_fechaInicial, nueva_fechaFinal, nuevo_anio) {
        this.nombre = nuevo_nombre;
        this.fechaInicial =  nueva_fechaInicial;
        this.fechaFinal = nueva_fechaFinal;
        this.anio = nuevo_anio;
    }


    static fetchAll() {
        return db.execute('SELECT * FROM periodo ORDER BY idPeriodo ASC');
    }

    savePeriodo() {
        return db.execute('INSERT INTO periodo (NombrePeriodo, fecha_incial, fecha_final , anio) VALUES (?,?,?,?)',
        [this.nombre, this.fechaInicial, this.fechasFinal, this.anio]);
    }

}



