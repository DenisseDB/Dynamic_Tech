// Dynamic Tech.
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const csrf = require('csurf');
const csrfProtection = csrf();

const multer = require('multer');
const rutas_users = require('./routes/user.routes'); // Usuario por autenticarse.
const rutas_feed = require('./routes/feedback.routes'); // Usuario sesionado.
const rutas_lead = require('./routes/lead.routes'); // Usuario sesionado.
const rutas_createfb = require('./routes/createfb.routes'); // Rutas para poder crear/generar/modificar cuestionarios.
const rutas_createPeriodo = require('./routes/createPeriodo.routes'); 



// Libreria que nos permite guardar credenciales en variables de retorno
const dotenv = require('dotenv').config({path: './.env'});
const port = process.env.PORT || 3000;


path = require('path');
const app = express();

// Configuración EJS.
app.set('view engine', 'ejs');
app.set('views', 'views');

// Archivos estáticos (public).
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Paquetes Node.js.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());

///fileStorage: Es nuestra constante de configuración para manejar el almacenamiento
const fileStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        //'uploads': Es el directorio del servidor donde se subirán los archivos 
        callback(null, 'uploads');
    },
    filename: (request, file, callback) => {
        //aquí configuramos el nombre que queremos que tenga el archivo en el servidor, 
        //para que no haya problema si se suben 2 archivos con el mismo nombre concatenamos el timestamp
        callback(null, new Date().getTime() + '-' + file.originalname);
    },
});
//En el registro, pasamos la constante de configuración y
//usamos single porque es un sólo archivo el que vamos a subir, 
//pero hay diferentes opciones si se quieren subir varios archivos. 
//'archivo' es el nombre del input tipo file de la forma
app.use(multer({ storage: fileStorage }).single('fotoPerfil'));

app.use(session({
    secret: 'Hola Zebrands',
    resave: false, //La sesión no se guardará en cada petición, sino sólo se guardará si algo cambió 
    saveUninitialized: false, //Asegura que no se guarde una sesión para una petición que no lo necesita
}));

// Rutas.
app.use('/', rutas_feed);
app.use('/', rutas_lead);

app.use('/users', rutas_users);
app.use('/feedback', rutas_createfb);
app.use('/Periodo', rutas_createPeriodo);

app.use((request, response, next) => {
    response.redirect('/users');
    next();
});

app.listen(port, () => {
   console.log('Servidor corriendo en el puerto ', port);
});