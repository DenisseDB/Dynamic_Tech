const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class formatoEvaluacion {

    //Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(nuevo_nombre, nueva_dimension, nuevo_nivel) {
        this.nombre = nuevo_nombre;
        this.nivel = nuevo_nivel;
        this.dimension = nueva_dimension;
    }

    static fetchCuestionarios() {
        //return db.execute('SELECT DISTINCT nombre, fecha, idDimension, nivelP FROM cuestionario C, preguntacuestionario PC, pregunta P WHERE C.idCuestionario = PC.idCuestionario AND PC.idPregunta = P.idPregunta; ');
        //return db.execute('SELECT DISTINCT nombre, fecha, idDimension, nivelP FROM cuestionario C, preguntacuestionario PC, pregunta P WHERE C.idCuestionario = PC.idCuestionario AND PC.idPregunta = P.idPregunta ORDER BY idDimension, fecha, nivelP ASC;');
        //return db.execute('SELECT DISTINCT nombre, fecha, idDimension, nivelP FROM cuestionario C, preguntacuestionario PC, pregunta P WHERE C.idCuestionario = PC.idCuestionario AND PC.idPregunta = P.idPregunta ORDER BY `P`.`nivelP` ASC, `C`.`fecha` DESC');
        return db.execute('SELECT DISTINCT nombre, idCuestionario, fecha, idDimension, nivelC FROM cuestionario C ORDER BY idDimension, fecha, nivelC ASC;');
    }

    // //Este método servirá para guardar de manera persistente el nuevo objeto. 
    saveCuestionario() {
        return db.execute('INSERT INTO cuestionario(nombre, fecha, nivelC, idDimension) VALUES(?, CURRENT_DATE(), ?, ?); ',
            [this.nombre, this.nivel, this.dimension]);
    }

    savePreguntasCuestionario() {
        let query = 'INSERT INTO preguntacuestionario VALUES';
        let arr = [];

        console.log(this.pregunta[0]);
        console.log(this.pregunta[1]);
        console.log(typeof this.pregunta[1] === 'undefined');


        for (let i = 0; i < this.pregunta.length; i++) {
            if (typeof this.pregunta[i] !== 'undefined') {
                query += '(LAST_INSERT_ID(), ? , CURRENT_DATE())';
                arr.push(this.pregunta[i]);

                if (typeof this.pregunta[i + 1] !== 'undefined') {
                    query += ',';
                }
                else {
                    query += ';';
                }

                console.log(query);
            }
        }

        return db.execute(query, arr);
    }
};

