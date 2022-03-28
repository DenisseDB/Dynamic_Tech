const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.get_login = (request, response, next) => {
    response.render('login', {
        correo: request.session.correo ? request.session.correo : '',
        info: ''
    });
};


exports.login = (request, response, next) => {
    User.findOne(request.body.correo)
        .then(([rows, fielData]) => {

            //Si no existe el correo, redirige a la pantalla de login
            if (rows.length < 1) {
                return response.redirect('/users/login');
            }

            // Revisión del save() usuario
            //const user = new User(rows[0].nombre,
            //   rows[0].correo, rows[0].idEmpleado, rows[0].idRol);

            request.session.isLoggedIn = true;
            request.session.idEmpleado = rows[0].idEmpleado;
            request.session.nombre = rows[0].nombre;
            request.session.correo = rows[0].correo;
            request.session.idRol = rows[0].idRol;

            return response.redirect('./tops/');

        }).catch((error) => {
            console.log(error);
        });

};

// ROLES AUTORIZADOS PARA TOPS
exports.tops = (request, response, next) => {
    User.rolMentorados()
    .then(([rows,fielData]) => {

        request.session.rolesPermitidos = rows,
     
        response.render('index', { // mandamos su informacion al sidenav
            correo: request.session.correo ? request.session.correo : '',
            rolesA: rows,
            rol: request.session.idRol ? request.session.idRol : '',

        });
        
    }).catch((error) => {
        console.log(error);
    });
};

exports.get_signup = (request, response, next) => {
    response.render('signup', {
        correo: request.session.correo ? request.session.correo : '',
        info: ''
    });
};

exports.post_signup = (request, response, next) => {
    const user =
        new User(request.body.nombre, request.body.apellidoP, request.body.apellidoM,
            request.body.correo, request.body.contrasena, request.body.idEquipo);
    user.save()
        .then(() => {
            response.redirect('/users/login');
        }).catch((error) => {
            console.log(error);
        });
};

exports.logout = (request, response, next) => {
    request.session.destroy(() => {
        response.redirect('/users/login'); //Este código se ejecuta cuando la sesión se elimina.
    });
};

exports.misMentorados = (request, response, next) => {
    User.fecthMentorados(request.session.idEmpleado)
        .then(([rows, fielData]) => {
            response.render('misMentorados',
                {
                    // TODO ESTO SE ENVIA A MISMENTORADOS.EJS
                    mentorados: rows, // llevar los mentorados
                    nombre: request.session.nombre, // sacar su nombre
                    correo: request.session.correo,  // correo del usurio que esta en header
                    rol: request.session.idRol, // obtener rol del usario
                }

            );
        }).catch((error) => {
            console.log(error);
        });
};

exports.root = (request, response, next) => {
    response.redirect('/users/login');
};