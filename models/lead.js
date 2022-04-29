const db = require('../util/database');
const bcrypt = require('bcryptjs');

module.exports = class ChapterLead {

    // Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(nombre, apellidoPaterno, apellidoMaterno, correo, contrasena, idEquipo, fotoPerfil, idRol, nivelCraft, nivelPeople, nivelBusiness) {
        this.nombre = nombre;
        this.apellidoP = apellidoPaterno;
        this.apellidoM = apellidoMaterno;
        this.correo = correo;
        this.contrasena = contrasena;
        this.idEquipo = idEquipo;
        this.fotoPerfil = fotoPerfil;
        this.idRol = idRol;
        this.nivelCraft = nivelCraft;
        this.nivelPeople = nivelPeople;
        this.nivelBusiness = nivelPeople;
    }

    // //Este método servirá para guardar de manera persistente el nuevo objeto. 
    save() {
        return bcrypt.hash(this.contrasena, 12)
            .then((password_cifrado) => {
                return db.execute('CALL agregarEmpleado (?,?,?,?,?,?,?,?,?,?,?)',
                    [this.nombre, this.apellidoP, this.apellidoM, this.correo,
                        password_cifrado, this.idEquipo, this.fotoPerfil, this.idRol, this.nivelCraft,
                    this.nivelPeople, this.nivelBusiness]);
            }).catch((error) => {
                console.log(error);
            });

    }

    //Para obtener los roles disponibles
    static fecthRoles() {
        return db.execute('SELECT idRol, descripcion from rol;');

    }

     //Para obtener todos los miebros del chapter
     static fecthMiembrosChapter() {
        return db.execute ('SELECT * from empleado where activo = 1;');

    }

     //Para obtener todos los miebros del chapter
    static fecthDimEmpleado() {
        return db.execute('SELECT * from dimempleado_actual;');
        //Para obtener los equipos disponibles
    }

    static fecthEquipos() {
        return db.execute('SELECT idEquipo, nombre from equipo;');

    }


    static fetchEmpleado(idEmpleado) {
        return db.execute
        ('SELECT e.idEmpleado,nombre,apellidoP,apellidoM,correo,contrasena,idEquipo,fotoPerfil,idRol, idDimension,nivelE from empleado e, rolempleado re,dimempleado_actual di WHERE e.idEmpleado = re.idEmpleado AND e.idEmpleado = di.idEmpleado and e.idEmpleado = ?;',
        [idEmpleado]);
   
        
    }

    static fetch(valor) {
        return db.execute('SELECT e.idEmpleado,nombre,apellidoP,apellidoM,correo,contrasena,idEquipo,fotoPerfil,idRol, idDimension,nivelE from empleado e, rolempleado re,dimempleado_actual di WHERE e.idEmpleado = re.idEmpleado AND e.idEmpleado = di.idEmpleado AND activo = 1 AND (nombre LIKE ? OR apellidoP LIKE ? OR apellidoM LIKE ?)', ['%'+valor+'%', '%'+valor+'%','%'+valor+'%']);
    }


    static eliminarEmpleado(idEmpleado) {
        return db.execute('UPDATE empleado SET activo = 0 WHERE idEmpleado= ?;', [idEmpleado]);
    }

    static modificarEmpleado(nombre,apellidoP,apellidoM,correo,contrasena, idEquipo, 
        idEmpleado, idRol, nivelCraft,nivelPeople, nivelBusiness,foto) {
        
        return db.execute("CALL modificarEmpleado (?,?,?,?,?,?,?,?,?,?,?,?);",
        [nombre,apellidoP,apellidoM,correo,contrasena,idEquipo,idEmpleado, idRol,nivelCraft,nivelPeople, nivelBusiness,foto]);
    }

    static fetchSolicitudesActuales() {
         return db.execute('SELECT r.idPeriodo, estatus, NombrePeriodo from retroalimentacion as r, periodo as p WHERE  p.idPeriodo = r.idPeriodo AND p.idPeriodo in (SELECT MAX(idPeriodo) FROM periodo);')
    }

    static fetchMentores() {
        return db.execute('SELECT idMentor,nombre, apellidoP, apellidoM, fotoPerfil FROM asignacionempleado,empleado WHERE idMentor = idEmpleado GROUP BY idMentor;')
   }

   static fetchMentorados() {
    return db.execute('SELECT idMentor, idMentorado, nombre, apellidoP, apellidoM FROM asignacionempleado,empleado WHERE idMentorado = idEmpleado;')
    }

    static fetchNoMentores(){
        return db.execute('SELECT * FROM `empleado` WHERE idEmpleado NOT IN (SELECT idMentor FROM asignacionempleado);')
    }

    static fetchNoMentorados(){
        return db.execute('SELECT * FROM `empleado` WHERE idEmpleado NOT IN (SELECT idMentorado FROM asignacionempleado);')
    }
  
   

}