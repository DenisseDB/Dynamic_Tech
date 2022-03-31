// const db = require('../util/database');
// const bcrypt = require('bcryptjs');

// module.exports = class Periodo{

//     //Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
//     constructor( PeriodoNombre, FechaInicial, FechaFinal, anioPeriodo) {
//        // this.idPeriodo = Periodo;
//         this.NombrePeriodo = PeriodoNombre;
//         this.fecha_inicial = FechaInicial;
//         this.fecha_final = FechaFinal;
//         this.anio = anioPeriodo;

//     }

//     // //Este método servirá para guardar de manera persistente el nuevo objeto. 
//     save() {
//         return db.execute('INSERT INTO periodo (NombrePeriodo,fecha_inicial,fecha_final, anio) VALUES (?, ?,?,?)',
//         [this.NombrePeriodo,this.fecha_incial,this.fecha_final]
//     );
//     }
    

//     static fetchAll() { return db.execute('SELECT * FROM periodo');    }
// }