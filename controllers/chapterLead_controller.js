const User = require('../models/user');
const Feed = require('../models/contestaFeed');
const Solicitud = require('../models/solicitud');
const Lead = require('../models/lead');
const res = require('express/lib/response');

exports.agregarEmpleados = (request, response, next) => {
    //Tomo las preguntas del cuestionario de Craft asignardo
   Lead.fecthRoles()
    .then(([roles, fieldData]) => {
         //Tomo las preguntas del cuestionario de People
      Lead.fecthEquipos()
        .then(([equipos,fieldData]) =>{
           
            response.render('empleadosChapter',{
                rolesA :  request.session.privilegiosPermitidos,
                rol: request.session.idRol ? request.session.idRol : '',
                roles : roles,
                equipos: equipos,
                // // TODO ESTO SE ENVIA A MISMENTORADOS.EJS
                // nombre: request.session.nombre, // sacar su nombre
            })

            }).catch(error => {
                console.log(error);
            });
        }).catch(error =>{
            console.log(error);
        });


};
