const User = require('../models/user');
const bcrypt = require('bcryptjs');


exports.get_login = (request, response, next) => {
   if (request.session.isLoggedIn == true) {
      response.redirect('/home');
  } else {
   response.render('login', {
      correo: request.session.correo ? request.session.correo : '',
      info: '',
      incorrecto: '',
   });
  }
};


exports.tops_id = (request, response, next) => {
   User.fetchDimensiones(request.params.id)
      .then(([rows, fieldData]) => {
         //console.log(rows);
         response.status(200).json(rows);
      })
      .catch(err => {
         console.log(err);
      });
};


exports.login = (request, response, next) => {
   User.findOne(request.body.correo)
      .then(([rows, fielData]) => {

         if (rows.length < 1) {
            return response.render('login', {
               correo: request.session.correo ? request.session.correo : '',
               info: '',
               incorrecto: 'incorrecto',
            });
         }

         //const user = new User(rows[0].nombre, rows[0].apellidoP, rows[0].correo, rows[0].contrasena, rows[0].fotoPerfil);
         const user = new User(rows[0].nombre, rows[0].apellidoP, rows[0].correo, rows[0].contrasena);
                  bcrypt.compare(request.body.contrasena, user.contrasena)
                           .then(doMatch => {
                                 if (doMatch) {
                                    request.session.isLoggedIn = true;
                                    request.session.idEmpleado = rows[0].idEmpleado;
                                    request.session.nombreSesion = user.nombre;
                                    request.session.apellidoPSesion = user.apellidoP;
                                    request.session.foto = rows[0].fotoPerfil;

                                    request.session.correo = user.correo;
                                    request.session.idRol = rows[0].idRol;
                                    request.session.idEquipo = rows[0].idEquipo;

                                 // Nivel en cada dimensi??n del sesionado
                                    request.session.craft = rows[0].nivelE;
                                    request.session.people = rows[1].nivelE;
                                    request.session.business = rows[2].nivelE;

                                    return request.session.save(err => {
                                       response.redirect('../home');
                                          });
                                 }
                              
                              response.render('login', {
                                 correo: request.session.correo ? request.session.correo : '',
                                 info: '',
                                 incorrecto: 'incorrecto',
                                 user_info: rows,
                                 });
                              }).catch(err => {
                                 response.redirect('/users/login');
                                 });
         //Si no existe el correo, redirige a la pantalla de login
         // if (rows.length < 1) {
         //    return response.redirect('/users/login');
         // }

         //    // Info. del usuario sesionado
         //    request.session.isLoggedIn = true;
         //    request.session.idEmpleado = rows[0].idEmpleado;
         //    request.session.nombreSesion = rows[0].nombre;
         //    request.session.apellidoPSesion = rows[0].apellidoP;
         //    console.log(rows[0].fotoPerfil)
         //    request.session.foto = rows[0].fotoPerfil;


         // request.session.correo = rows[0].correo;
         // request.session.idRol = rows[0].idRol;

         // // Nivel en cada dimensi??n del sesionado
         // request.session.craft = rows[0].nivelE;
         // request.session.people = rows[1].nivelE;
         // request.session.business = rows[2].nivelE;

         // Redirecci??n al HOME
         //return response.redirect('../home');

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
         request.body.correo, request.body.contrasena, request.body.idEquipo,request.body.foto);
   user.save()
      .then(() => {
         response.redirect('/users/login');
      }).catch((error) => {
         console.log(error);
      });
};

exports.logout = (request, response, next) => {
   request.session.destroy(() => {
      response.redirect('/users/login'); //Este c??digo se ejecuta cuando la sesi??n se elimina.
   });
};

exports.root = (request, response, next) => {
   response.redirect('/users/login');
};