const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class ChapterLead {

    //Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(idEmpleado,nombre,apellidoPaterno,apellidoMaterno,correo,contraseña,idEquipo, idRol,fotoPerfil) {
        this.idEmpleado = idEmpleado;
        this.nombre = nombre;
        this.apellidoP = apellidoPaterno;
        this.apellidoM = apellidoMaterno;
        this.correo = correo;
        this.contraseña = contraseña;
        this.idEquipo = idEquipo;
        this.idRol = idRol;
        this.fotoPerfil = fotoPerfil;
    }

    // //Este método servirá para guardar de manera persistente el nuevo objeto. 
    save() {
        //Llamo a un procedue que a la vez es una transacción
        /* Lo que hace es realizar un insert de una pregunta-respuesta y cambia el
        estatus de respondida a true */
        return db.execute('CALL agregarEmpleado (?,?,?,?,?,?,?,?,?,?,?)',
        [ this.idEmpleado,this.nombre,this.apellidoP, this.apellidoM, this.correo,
            this.contraseña, this.idEquipo, this.idRol,this.fotoPerfil] );
    }

     //Para obtener los roles disponibles
     static fecthRoles() {
        return db.execute ('SELECT idRol, descripcion from rol;');

    }

     //Para obtener los equipos disponibles
     static fecthEquipos() {
        return db.execute ('SELECT idEquipo, nombre from equipo;');

    }

     //Para obtener todos los miebros del chapter
     static fecthMiembrosChapter() {
        return db.execute ('SELECT * from empleado;');

    }

     //Para obtener todos los miebros del chapter
     static fecthDimEmpleado() {
        return db.execute ('SELECT * from dimempleado;');

    }



}