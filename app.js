const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
// evitar ataques
const csrf = require('csurf');
const csrfProtection = csrf();

// pasamos a las rutas
const rutas_users = require('./routes/user.routes');
const rutas_feed = require('./routes/feedback.routes');
const rutas_createfb = require('./routes/createfb.routes');
const rutas_periodo = require('./routes/periodo.routes');

const path = require('path');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({
    secret: 'Hola Zebrands', 
    resave: false, //La sesión no se guardará en cada petición, sino sólo se guardará si algo cambió 
    saveUninitialized: false, //Asegura que no se guarde una sesión para una petición que no lo necesita
}));

// app.use(csrfProtection); S


// app.use((request, response, next) => {
//     response.locals.csrfToken = request.csrfToken();
//     next();
// });


//Para login
app.use('/', rutas_feed);
app.use('/users', rutas_users);
app.use('/feedback', rutas_createfb);
app.use('/periodo', rutas_periodo);


//Middleware página principal
app.use((request, response, next) => {
    response.redirect('/users');
    next();
});

app.listen(3000);//