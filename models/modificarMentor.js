const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class ChapterLeadMentores {

    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(idMentor, idMentorado) {
        this.idMentor = idMentor;
        this.idMentorado = idMentorado;
        
    }

    // //Este método servirá para guardar de manera persistente el nuevo objeto. 
    saveMentor() {
        return db.execute('INSERT INTO asignacionempleado(idMentor, idMentorado) VALUES (?, ?);', [this.idMentor, this.idMentorado]);
    }



  
   

}