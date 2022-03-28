const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class formatoEvaluacion {

    //Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(nuevo_nombre, nuevo_nivel, nueva_dimension) {
        this.nombre = nuevo_nombre;
        this.nivel = nuevo_nivel;
        this.dimension = nueva_dimension;
    }

    // //Este método servirá para guardar de manera persistente el nuevo objeto. 
    save() {
        return db.execute('INSERT INTO Cuestionario (nombre, fecha) VALUES (?, CURRENT_DATE())',
        [this.nombre]);
    }
}