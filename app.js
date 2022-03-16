const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const csrf = require('csurf');
const csrfProtection = csrf();


const rutas_audiovisual = require('./routes/audiovisual.routes');
const rutas_musica = require('./routes/musica.routes');
const rutas_users = require('./routes/user.routes');
const path = require('path');



const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: 'Hola soy Jordana', 
    resave: false, //La sesión no se guardará en cada petición, sino sólo se guardará si algo cambió 
    saveUninitialized: false, //Asegura que no se guarde una sesión para una petición que no lo necesita
}));

// app.use(csrfProtection); 

// app.use((request, response, next) => {
//     response.locals.csrfToken = request.csrfToken();
//     next();
// });


//Para login
app.use('/users', rutas_users);
//Para audio visuales
app.use('/audioVisual', rutas_audiovisual);
//Para música
app.use('/musica', rutas_musica);


//Middleware página principal
app.use((request, response, next) => {
    response.redirect('/users');
    next();
});


app.use((request, response, next) => {
    console.log('Otro middleware!');
    response.send('Aquí no hay nada'); //Manda la respuesta
});

app.listen(3000);