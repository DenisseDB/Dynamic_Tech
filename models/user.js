const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class User {

    //Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(nuevo_nombre,nuevo_aP, nuevo_aM, nuevo_correo, nuevo_password,nuevo_idEquipo) {
        this.nombre = nuevo_nombre;
        this.apellidoP = nuevo_aP;
        this.apellidoM = nuevo_aM;
        this.correo = nuevo_correo;
        this.contrasena = nuevo_password;
        this.idEquipo = nuevo_idEquipo;
    }

    // //Este método servirá para guardar de manera persistente el nuevo objeto. 
    save() {
        return bcrypt.hash(this.constrasena, 12)
            .then((password_cifrado)=>{
                return db.execute(
                    'INSERT INTO empleado(nombre,apellidoP,apellidoM,correo,contrasena,idEquipo) VALUES(?,?,?,?,?,?)',
                    [this.nombre, this.apellidoP, this.apellidoM,
                        this.correo, password_cifrado,this.idEquipo]);
            }).catch((error)=>{
                console.log(error);
            }); 
    }

    //El primer rol es ver mentorados
    static rolMentorados() {
        return db.execute('SELECT idRol FROM rolprivilegio WHERE idPrivilegio = 1 ',);

    }

    static fecthMentorados(idEmpleado) {
        return db.execute('SELECT nombre FROM Empleado E, asignacionempleado AE WHERE E.idEmpleado = AE.idMentorado AND AE.idMentor = ?',
            [idEmpleado]);

    }

    //Este método servirá para devolver los objetos del almacenamiento persistente.
    static findOne(correo) {
        return db.execute('SELECT nombre,correo,E.idEmpleado,idRol FROM empleado E, rolEmpleado RE WHERE E.idEmpleado = RE.idEmpleado AND correo=?',
            [correo]);
    }

}