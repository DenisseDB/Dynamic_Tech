const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.get_login = (request, response, next) => {
    response.render('login', {
        correo: request.session.correo ? request.session.correo : '',
        info: ''
    }); 
};

exports.tops = (request, response, next) => {
    response.render('index', {
        correo: request.session.correo ? request.session.correo : '',
    }); 
};

exports.login = (request, response, next) => {
    User.findOne(request.body.correo)
        .then(([rows, fielData])=>{
            console.log(rows);
            //Si no existe el correo, redirige a la pantalla de login
            if (rows.length < 1) {
                return response.redirect('/users/login');
            }
            const user = new User(rows[0].nombre,
               rows[0].correo, rows[0].idEmpleado,rows[0].idRol);

            request.session.isLoggedIn = true;
            request.session.idEmpleado = user.idEmpleado;
            request.session.nombre = user.nombre;
            return response.redirect('./tops/');
           

            
        

            // if(request.body.contrasena = user.contrasena ){
            //      response.redirect('./tops/');
            // }

        //     bcrypt.compare(request.body.contrasena, user.contrasena)
        //         .then(doMatch => {
        //             if (doMatch) {
        //                 request.session.isLoggedIn = true;
        //                 request.session.user = user;
        //                 request.session.correo = user.nombre;
        //                 return request.session.save(err => {
        //                     response.redirect('./tops');
        //                 });
        //             }
        //             response.redirect('/users/login');
        //         }).catch(err => {
        //             response.redirect('/users/login');
        //         });
        // }).catch((error)=>{
        //     console.log(error)
        // });
        }
    
    )};

exports.get_signup = (request, response, next) => {
    response.render('signup', {
        correo: request.session.correo ? request.session.correo : '',
        info: ''
    }); 
};

exports.post_signup = (request, response, next) => {
    const user = 
        new User(request.body.nombre,request.body.apellidoP,request.body.apellidoM,
             request.body.correo, request.body.contrasena,request.body.idEquipo);
    user.save()
        .then(()=>{
            response.redirect('/users/login'); 
        }).catch((error)=>{
            console.log(error);
        });
};

exports.logout = (request, response, next) => {
    request.session.destroy(() => {
        response.redirect('/users/login'); //Este código se ejecuta cuando la sesión se elimina.
    });
};

exports.misMentorados= (request, response, next) => {
    User.fecthMentorados(request.session.idEmpleado)
    .then(([rows, fielData])=>{
        console.log(rows);
        //Si no existe el correo, redirige a la pantalla de login
        // const user = new User(rows[0].nombre,
        //    rows[0].correo, rows[0].idEmpleado,rows[0].idRol);

        // request.session.isLoggedIn = true;
        // request.session.idEmpleado = user.idEmpleado;
        response.render('misMentorados',
        {
            mentorados : rows,
            nombre : request.session.nombre
        }

        );
    }
       
    )};

exports.root = (request, response, next) => {
    response.redirect('/users/login'); 
};