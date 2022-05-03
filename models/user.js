const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class User {

    //Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    //constructor(nuevo_nombre, nuevo_aP, nuevo_aM, nuevo_correo, nuevo_password, nuevo_idEquipo, nueva_foto) {
    constructor(nuevo_nombre, nuevo_aP, nuevo_correo, nuevo_password) {
        this.nombre = nuevo_nombre;
        this.apellidoP = nuevo_aP;
        //this.apellidoM = nuevo_aM;
        this.correo = nuevo_correo;
        this.contrasena = nuevo_password;
        //this.idEquipo = nuevo_idEquipo;
        //this.fotoPerfil = nueva_foto;
    }

   // Este método servirá para guardar de manera persistente el nuevo objeto. 
   save() {
      return bcrypt.hash(this.constrasena, 12)
         .then((password_cifrado) => {
            return db.execute(
               'INSERT INTO empleado(nombre,apellidoP,apellidoM,correo,contrasena,idEquipo) VALUES(?,?,?,?,?,?)',
               [this.nombre, this.apellidoP, this.apellidoM,
                  this.correo, password_cifrado, this.idEquipo
               ]);
         }).catch((error) => {
            console.log(error);
         });
   }

   // El primer rol es ver mentorados
   static rolMentorados() {
      return db.execute('SELECT idRol FROM rolprivilegio WHERE idPrivilegio = 1 ', );

   }

   static fecthMentorados(idEmpleado) {
      //return db.execute('SELECT nombre, apellidoP, apellidoM FROM empleado E, asignacionempleado AE WHERE E.idEmpleado = AE.idMentorado AND AE.idMentor = ?',
      //    [idEmpleado]);
      //SELECT idMentorado, nombre, apellidoP, apellidoM, nivelE FROM empleado E, asignacionempleado AE, dimempleado_actual DA WHERE E.idEmpleado = AE.idMentorado AND DA.idEmpleado = AE.idMentorado AND AE.idMentor = 1

      return db.execute('SELECT idMentorado, nombre, apellidoP, apellidoM, nivelE,fotoPerfil FROM empleado E, asignacionempleado AE, dimempleado_actual DA WHERE E.idEmpleado = AE.idMentorado AND DA.idEmpleado = AE.idMentorado AND AE.idMentor = ?',
         [idEmpleado]);

   }

    //Este método servirá para devolver los objetos del almacenamiento persistente.
    static findOne(correo) {
        //return db.execute('SELECT nombre,correo,E.idEmpleado,idRol FROM empleado E, rolEmpleado RE WHERE E.idEmpleado = RE.idEmpleado AND correo=?',
        //    [correo]);
        return db.execute('SELECT E.idEmpleado, nombre, apellidoP, apellidoM, correo, contrasena, idEquipo, fotoPerfil, idRol, idDimension, nivelE, DE.fecha FROM empleado E, rolempleado RE, dimempleado_actual DE WHERE E.idEmpleado = RE.idEmpleado AND E.idEmpleado = DE.idEmpleado AND correo = ? ORDER BY idDimension ASC;',
            [correo]);
    }

   // Para obtener los privilegios que tenga un usuario sesionado
   static fecthPrivilegios(idEmpleadoRol) {
      return db.execute('SELECT idPrivilegio FROM rolprivilegio where idRol = ?;',
         [idEmpleadoRol]);

   }

   static fetchDimensiones(idEmpleado) {
      return db.execute('SELECT D.idDimension, nivelE, fecha FROM dimempleado DE, dimension D WHERE DE.idDimension = D.idDimension AND idEmpleado=? ORDER BY nombre, fecha',
         [idEmpleado]);

   }

   static fetchDimensiones_actuales(idEmpleado) {
      return db.execute('SELECT nivelE FROM dimempleado_actual DE WHERE idEmpleado=?',
         [idEmpleado]);

   }
   static fetchNombre(idEmpleado) {
      return db.execute('SELECT nombre, apellidoP FROM empleado DE WHERE idEmpleado=?',
         [idEmpleado]);

   }

   static findEquipo() { 
      return db.execute('SELECT idEquipo, nombre FROM equipo');
   }

   /*static fetchDimensiones(idEmpleado) {
       return db.execute('SELECT nombre, nivelE FROM dimEmpleado DE, Dimension D WHERE DE.idDimension = D.idDimension AND idEmpleado=?',
           [idEmpleado]);

   }*/

};