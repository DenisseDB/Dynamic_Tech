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

            // Info. del usuario sesionado
            request.session.isLoggedIn = true;
            request.session.idEmpleado = rows[0].idEmpleado;
            request.session.nombre = rows[0].nombre;
            request.session.correo = rows[0].correo;
            request.session.idRol = rows[0].idRol;

            // Nivel en cada dimensión del sesionado
            request.session.craft = rows[0].nivelE;
            request.session.people = rows[1].nivelE;
            request.session.business = rows[2].nivelE;

            // Redirección al HOME
            return response.redirect('../home');

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

exports.root = (request, response, next) => {
    response.redirect('/users/login');
};