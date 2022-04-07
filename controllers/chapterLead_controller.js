const User = require('../models/user');
const Feed = require('../models/contestaFeed');
const Solicitud = require('../models/solicitud');
const Lead = require('../models/lead');
const res = require('express/lib/response');

exports.agregarEmpleados = (request, response, next) => {
    //Tomo las preguntas del cuestionario de Craft asignardo
    Lead.fecthRoles()
        .then(([roles, fieldData]) => {

            let nsuccess = request.session.success;
            request.session.success = '';

            //Tomo las preguntas del cuestionario de People
            Lead.fecthEquipos()
                .then(([equipos, fieldData]) => {
                    Lead.fecthMiembrosChapter()
                        .then(([miembros, fieldData]) => {

                            Lead.fecthDimEmpleado()
                                .then(([dimEmpleado, fieldData]) => {
                                    const success = request.session.empleadoSuccess ? request.session.empleadoSuccess : false;
                                    request.session.empleadoSuccess = false;
                                    response.render('empleadosChapter', {
                                        rolesA: request.session.privilegiosPermitidos,
                                        rol: request.session.idRol ? request.session.idRol : '',
                                        roles: roles,
                                        equipos: equipos,
                                        miembros: miembros,
                                        dimEmpleado: dimEmpleado,
                                        notificacion : nsuccess ? nsuccess : '',
                                        success: success,

                                    })


                                }).catch(error => {
                                    console.log(error);
                                });



                        }).catch(error => {
                            console.log(error);
                        });


                }).catch(error => {
                    console.log(error);
                });
        }).catch(error => {
            console.log(error);
        });


};

exports.guardarEmpleado = (request, response, next) => {

    console.log("Salvar empleado");
    console.log(request.body);

    var empleado = new Lead (request.body.nombre,request.body.apellidoP,request.body.apellidoM,
        request.body.email,request.body.password,request.body.equipo, request.file.filename, request.body.rol,
        request.body.nivelCraft,request.body.nivelPeople,request.body.nivelBusiness);

        empleado.save().then(() => {
            request.session.empleadoSuccess = true;
            response.redirect('/empleados'); 
        }).catch(err => console.log(err));

    

    

};

