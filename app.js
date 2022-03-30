// Dynamic Tech.
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const csrf = require('csurf');
const csrfProtection = csrf();
const rutas_users = require('./routes/user.routes'); // Usuario por autenticarse.
const rutas_feed = require('./routes/feedback.routes'); // Usuario sesionado.

const path = require('path');
const app = express();

// Configuración EJS.
app.set('view engine', 'ejs');
app.set('views', 'views');

// Archivos estáticos (public).
app.use(express.static(path.join(__dirname, 'public')));

// Paquetes Node.js.
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: 'Hola Zebrands', 
    resave: false, //La sesión no se guardará en cada petición, sino sólo se guardará si algo cambió 
    saveUninitialized: false, //Asegura que no se guarde una sesión para una petición que no lo necesita
}));

// Rutas.
app.use('/', rutas_feed);
app.use('/users', rutas_users);

app.use((request, response, next) => {
    response.redirect('/users');
    next();
});

app.listen(3000);