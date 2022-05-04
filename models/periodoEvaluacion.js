const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class PeriodoEvaluacion {

    constructor(nuevo_nombre, nueva_fechaInicial, nueva_fechaFinal, nuevo_anio) {
        this.nombre = nuevo_nombre;
        this.fechaInicial = nueva_fechaInicial;
        this.fechaFinal = nueva_fechaFinal;
        this.anio = nuevo_anio;
    }


    static fetchAll() {
        return db.execute('SELECT * FROM periodo ORDER BY idPeriodo ASC');
    }

    static fetchUltimo() { 
        return db.execute('SELECT * FROM periodo ORDER BY idPeriodo DESC LIMIT 1;');
    }

    savePeriodo() {

        return db.execute('INSERT INTO periodo(NombrePeriodo, fecha_inicial, fecha_final, anio) VALUES (?,?,?,?)',
            [this.nombre, this.fechaInicial, this.fechaFinal, this.anio]);
    }

    modifyPeriodo(idPeriodo) {

        return db.execute('UPDATE periodo SET NombrePeriodo=?, fecha_inicial=?, fecha_final=?, anio=? WHERE idPeriodo=?',
            [this.nombre, this.fechaInicial, this.fechaFinal, this.anio, idPeriodo]);
    }


}



