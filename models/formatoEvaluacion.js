const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class formatoEvaluacion {

    //Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(nuevo_nombre, nueva_dimension, nuevo_nivel, nueva_pregunta = []) {
        this.nombre = nuevo_nombre;
        this.nivel = nuevo_nivel;
        this.dimension = nueva_dimension;
        this.pregunta = nueva_pregunta
    }

    // //Este método servirá para guardar de manera persistente el nuevo objeto. 
    saveCuestionario() {
        return db.execute('INSERT INTO Cuestionario(nombre, fecha) VALUES(?, CURRENT_DATE()); ',
            [this.nombre]);
    }

    savePreguntasCuestionario() {
        let query = 'INSERT INTO preguntaCuestionario VALUES'

        for (let i = 0; i < this.pregunta.length; i++) {
            query += '(LAST_INSERT_ID(), ? , CURRENT_DATE())';

            if (i < this.pregunta.length - 1) {
                query += ',';
            }
            else {
                query += ';';
            }

            console.log(query);
        }

        console.log(this.pregunta[0]);
        console.log(this.pregunta[1]);

        return db.execute(query, [this.pregunta[0], this.pregunta[1]]);
        /*return db.execute('INSERT INTO preguntaCuestionario VALUES(LAST_INSERT_ID(), ? , CURRENT_DATE());',
            [this.pregunta[i]]);*/

        /*return db.execute('INSERT INTO preguntaCuestionario VALUES(LAST_INSERT_ID(), ? , CURRENT_DATE());',
            [this.pregunta]);*/

    }
}

