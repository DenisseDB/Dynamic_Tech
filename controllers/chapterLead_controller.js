const User = require('../models/user');
const Lead = require('../models/lead');
const Historial = require('../models/historico');
const Mentor = require('../models/modificarMentor');
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
        nivel_businesspg: niv[0][2].nivelE,
        ruta : "/empleados/feedback/"
    });
};

exports.detalleEmpleado = async (request, response, next) => {
    // console.log("Llegué aquí");
    let evaluador = request.body.IdEval;
    let periodo = request.body.IdPed;
    let evaluado = request.params.idEmpleado;
    let idcraft = request.body.IdCraft;
    let idPeople = request.body.IdPeople;
    let idCommercial = request.body.IdCommercial;

    const rCraft = await Historial.fetchFeedDetallado(idcraft, evaluado, evaluador, periodo); // Retro del Cuestionario Craft.
    const rPeople = await Historial.fetchFeedDetallado(idPeople, evaluado, evaluador, periodo); // Retro del Cuestionario People.
    const rBusiness = await Historial.fetchFeedDetallado(idCommercial, evaluado, evaluador, periodo); // Retro del Cuestionario Business.
    const sol = await Historial.fetchSolicitud(evaluado, evaluador, periodo); // Detalle del Periodo y Evaluador.
    const lvl = await Historial.fetchNiveles(idcraft, idPeople, idCommercial); // Detalle de los niveles al momento de la solicitud.
    const nom = await User.fetchNombre(request.params.idEmpleado);
    
    response.render('detalleFeedback.ejs',
    {
        rolesA :  request.session.privilegiosPermitidos,
        craft : rCraft,
        people : rPeople,
        business : rBusiness,
        solicitud : sol,
        niveles: lvl,
        nombreSesion: request.session.nombreSesion,
        apellidoPSesion: request.session.apellidoPSesion,
        foto: request.session.foto,
        nombre_empleado: nom[0][0].nombre,
        apellido_empleado: nom[0][0].apellidoP,
        id_empleado: request.params.id,
        self: '1',
        ruta : '/empleados/detalleFeedback'
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
        })
        .catch(err => {
            console.log(err);
        });
};

exports.agregarMentor = (request, response, next) => {

    Lead.fetchNoMentores()
        .then(([noMentores, fielData]) => {

            Lead.fetchNoMentorados()
                .then(([noMentorados, fielData]) => {

                    response.render('agregarMentor', {

                        correo: request.session.correo ? request.session.correo : '',
                        rolesA: request.session.privilegiosPermitidos,
                        rol: request.session.idRol ? request.session.idRol : '',
                        noMentores: noMentores,
                        noMentorados: noMentorados,
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
};


exports.agregarNuevoMentor = async (request, response, next) => {

    console.log(request.body.mentorado);
    console.log(request.body.mentorados);

    var mentorado = request.body.mentorados;

    // for (let nuevoMentorado of mentorado ) {
    //             console.log(nuevoMentorado);
    //         }
    
    try {
        //Ciclo for para realizar insert de mentorados a mentor 
        for (let nuevoMentorado of mentorado ) {
            let res = new Mentor(request.body.mentorado,nuevoMentorado);
            await res.saveMentor();
        }
        response.redirect('/miChapter');

    } catch (error) {
        console.log(error);
    }
};

exports.eliminarMentor = (request, response, next) => {

    console.log(request.params.idMentor);

    Lead.eliminarMentor(request.params.idMentor)
           .then(([rows,fieldData]) =>{ 

               response.redirect('/miChapter');

           }).catch(error => {
               console.log(error);
           });
};


exports.modificarMentor = (request, response, next) => {

    //console.log(request.session.foto);

    Lead.fetchMentor(request.params.idMentor)
        .then(([Mentor, fielData]) => {

            //console.log(Mentor);

            Lead.fetchNoMentorados()
                .then(([noMentorados, fielData]) => {

                    Lead.fetchMentorado(request.params.idMentor)
                    .then(([mentorados, fielData]) => {

                    response.render('modificarMentor', {

                        correo: request.session.correo ? request.session.correo : '',
                        rolesA: request.session.privilegiosPermitidos,
                        rol: request.session.idRol ? request.session.idRol : '',
                        nombreSesion: request.session.nombreSesion,
                        apellidoPSesion: request.session.apellidoPSesion,
                        foto: request.session.foto,
                        mentor : Mentor,
                        mentorados: mentorados,
                        noMentorados: noMentorados,



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

exports.mentorModificado = async (request, response, next) => {

    var mentorado = request.body.mentorado; 

    try {
        //Ciclo for para realizar insert de mentorados a mentor 
        for (let nuevoMentorado of mentorado ) {
            let res = new Mentor(request.params.idMentor,nuevoMentorado);
            await res.saveMentor();
        }
        response.redirect('/miChapter/modificarMentor/'+request.params.idMentor+"'");

    } catch (error) {
        console.log(error);
    }
    

};

exports.eliminarMentorado = (request, response, next) => {

    //console.log(request.params.idMentor);
    //console.log(request.params.idMentorado);

    Lead.eliminarMentorado(request.params.idMentor,request.params.idMentorado)
           .then(([rows,fieldData]) =>{ 

               response.redirect('/miChapter/modificarMentor/'+request.params.idMentor+"'");

           }).catch(error => {
               console.log(error);
           });
};

exports.miChapter = (request, response, next) => {

    Lead.fetchMentores()
    .then(([mentores, fieldData]) => {

        Lead.fetchMentorados()
        .then(([mentorados, fieldData]) => {

        response.render('miChapter', {

            correo: request.session.correo ? request.session.correo : '',
            rolesA: request.session.privilegiosPermitidos,
            rol: request.session.idRol ? request.session.idRol : '',
            nombreSesion: request.session.nombreSesion,
            apellidoPSesion: request.session.apellidoPSesion,
            foto: request.session.foto,
            mentores: mentores,
            mentorados: mentorados,

        });
    })
        
    .catch(err => {
        console.log(err);
    }); 
    })
    .catch(err => {
    console.log(err);
    });
  
    

};
