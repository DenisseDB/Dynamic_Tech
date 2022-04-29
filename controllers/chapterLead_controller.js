const User = require('../models/user');
const Feed = require('../models/contestaFeed');
const Solicitud = require('../models/solicitud');
const Lead = require('../models/lead');
const Historial = require('../models/historico');
const res = require('express/lib/response');
const bcrypt = require('bcryptjs');

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
                                        notificacion: nsuccess ? nsuccess : '',
                                        success: success,
                                        nombreSesion: request.session.nombreSesion,
                                        apellidoPSesion: request.session.apellidoPSesion,
                                        foto: request.session.foto,

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

    console.log(request.file ? request.file.filename : 'iconperfil.png');

    // var file;

    var empleado = new Lead(
        request.body.nombre, request.body.apellidoP, request.body.apellidoM,
        request.body.email, request.body.password, request.body.equipo, 
        request.file ? request.file.filename : 'iconperfil.png' , request.body.rol,
        request.body.nivelCraft, request.body.nivelPeople, request.body.nivelBusiness
        );

    empleado.save().then(() => {
        request.session.empleadoSuccess = true;
        response.redirect('/empleados');
    }).catch(err => console.log(err));


};

exports.feedbackEmpleado = async (request, response, next) => {
    const empleado = request.params.idEmpleado; // Empleado para el cual se consulta su feedback.
    const niv = await User.fetchDimensiones_actuales(empleado); // Nivel del empleado de la consulta.
    const nom = await User.fetchNombre(empleado); // Nombre del empleado de la consulta.
    const pds = await Historial.fetchAllPeriodo(); // Periodos de evaluación.
    const hs = await Historial.fetchFeedHistorico(empleado); // Histórico de solicitudes respondidas.
    const dsG = await Historial.fetchDesempenioG(empleado); // Promedio de Desempeño por Periodo (General).
    let dsI = [];

    for await (let x of hs) {
        let especifico = await Historial.fetchDesempenioE(x.idCuestionarioCraft, x.idCuestionarioPeople, x.idCuestionarioBusiness,
            empleado, x.idEvaluador, x.idPeriodo);
        dsI.push(especifico);
    }

    response.render('miFeedback.ejs',
    {
        idSesionado: request.session.idEmpleado,
        rolesA :  request.session.privilegiosPermitidos,
        periodos : pds,
        retroalimentaciones : hs,
        especifico : dsI,
        general : dsG,
        nombreSesion: request.session.nombreSesion,
        apellidoPSesion: request.session.apellidoPSesion,
        foto: request.session.foto,
        nombre_empleado: nom[0][0].nombre,
        apellido_empleado: nom[0][0].apellidoP,
        idEmpleado: empleado,
        nivel_craftpg: niv[0][0].nivelE,
        nivel_peoplepg: niv[0][1].nivelE,
        nivel_businesspg: niv[0][2].nivelE
    });
};

exports.modificarEmpleado = (request, response, next) => {

    Lead.fetchEmpleado(request.params.idEmpleado)
        .then(([rows, fielData]) => {

        request.session.fotoEmpleado = rows[0].fotoPerfil;
        request.session.passEmpleado = rows[0].contrasena;

            Lead.fecthEquipos(request.params.idEmpleado)
                .then(([equipos, fielData]) => {

                    Lead.fecthRoles(request.params.idEmpleado)
                        .then(([roles, fielData]) => {

                            response.render('modificarEmpleado', {

                                correo: request.session.correo ? request.session.correo : '',
                                rolesA: request.session.privilegiosPermitidos,
                                rol: request.session.idRol ? request.session.idRol : '',
                                empleado: rows,
                                equipos: equipos,
                                roles: roles,
                                nombreSesion: request.session.nombreSesion,
                                apellidoPSesion: request.session.apellidoPSesion,
                                foto: request.session.foto,


                            });




                        }).catch((error) => {
                            console.log(error);
                        });





                }).catch((error) => {
                    console.log(error);
                });




        }).catch((error) => {
            console.log(error);
        });




};

exports.empleadoModificado = (request, response, next) => {

    // console.log(request.body);   
    // console.log(request.file);
    // console.log(request.session.fotoEmpleado);
    // request.file ? request.file.filename : request.session.fotoEmpleado,
    // console.log("contraseña" + request.body.contrasena);

     var hash ="";
     if (request.body.contrasena === ""){

        hash =  request.session.passEmpleado;

     } else{
        hash = bcrypt.hashSync(request.body.contrasena, 12);
     }


    Lead.modificarEmpleado(request.body.nombre,request.body.apellidoP,
        request.body.apellidoM,request.body.correo,
        hash, 
        request.body.equipo,request.params.idEmpleado, request.body.rol, 
        request.body.nivelCraft,request.body.nivelPeople, request.body.nivelBusiness,
        request.file ? request.file.filename : request.session.fotoEmpleado)
                        .then(([rows, fielData]) => {

                            response.redirect('/empleados');


                        }).catch((error) => {
                            console.log(error);
                        });

};

exports.eliminarEmpleado = (request, response, next) => {

    console.log(request.params.idEmpleado);

    Lead.eliminarEmpleado(request.params.idEmpleado)
           .then(([rows,fieldData]) =>{ 

               response.redirect('/empleados');

           }).catch(error => {
               console.log(error);
           });

};

exports.buscarEmpleado = (request, response, next) => {
    console.log(request.params.valor);

    Lead.fecthDimEmpleado()
    .then(([dimEmpleado, fieldData]) => {
    Lead.fetch(request.params.valor)
        .then(([rows, fieldData]) => {
            //console.log(rows);
            response.status(200).json(rows);
        })
    
        .catch(err => {
            console.log(err);
        }); 
    })
    .catch(err => {
        console.log(err);
    });
}

exports.respondidas = (request, response, next) => {
    Lead.fetchSolicitudesActuales()
    .then(([respondidas, fieldData]) => {
          //console.log(rows);
          response.status(200).json(respondidas);
          response.redirect('/miChapter');
       })
       .catch(err => {
          console.log(err);
       });
 };

exports.miChapter = (request, response, next) => {

    response.render('miChapter', {

        correo: request.session.correo ? request.session.correo : '',
        rolesA: request.session.privilegiosPermitidos,
        rol: request.session.idRol ? request.session.idRol : '',
        nombreSesion: request.session.nombreSesion,
        apellidoPSesion: request.session.apellidoPSesion,
        foto: request.session.foto,

    });
};
