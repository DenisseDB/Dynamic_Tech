const path = require('path');
const Peliculas = require('../models/audioVisual/peliculas');
const Series = require('../models/audioVisual/series');
const Caricaturas = require('../models/audioVisual/caricaturas');

const peliculas = [];
const series = [];
const caricaturas = [];

exports.get_nueva_peli = (request, response, next) => {
    Peliculas.fetchAllPeliculas()
        .then(([rows, fieldData]) => {
            response.render('nuevaPeli', {
                peliculas: rows,
                username: request.session.username ? request.session.username : '',
            })
        })
        .catch(err => console.log(err));
}
   

exports.post_nueva_peli = (request, response, next) => {    
    const peli = new Peliculas(request.body.nombre, request.body.sinopsis,request.body.imagen);
    peli.save().then(() => {
        response.setHeader('Set-Cookie', 'ultima_pelicula='+peli.nombre+'; HttpOnly', 'utf8');
        response.render()
    }).catch(err => console.log(err));
    
};

//Para obtener las películas con su id con /audioVisual/idPelicula
exports.getPelicula = (request, response, next) => {
    console.log(request.params.idPelicula);
  
    console.log(request.cookies);
    Peliculas.fetchOnePeli(request.params.idPelicula)
        .then(([rows, fieldData]) => {
            console.log(rows);
            response.render('pelicula', {
                peliculas: rows,
                username: request.session.username ? request.session.username : '',
                ultima_pelicula: request.cookies.ultima_pelicula ? request.cookies.ultima_pelicula : '',
               
            }); 
        })
        .catch(err => {
            console.log(err);
        }); 
}

exports.get_nueva_serie = (request, response, next) => {
    Series.fetchAllSeries()
    .then(([rows, fieldData]) => {
        response.render('nuevaSerie', {
            series: rows,
            username: request.session.username ? request.session.username : '',
        })
    })
    .catch(err => console.log(err));
}

exports.post_nueva_serie = (request, response, next) => {
    console.log('POST /audioVisual/nuevaSerie');
    const serie = new Series(request.body.nombre, request.body.sinopsis,request.body.imagen);
    serie.save().then(() => {
        response.setHeader('Set-Cookie', 'ultima_serie='+serie.nombre+'; HttpOnly', 'utf8');
        response.redirect('/audioVisual');
    }).catch(err => console.log(err));
};


exports.get_nueva_caricatura = (request, response, next) => {
    console.log('GET /audioVisual/nuevaCaricatura');
    response.render('nuevaCaricatura',{
        username: request.session.username ? request.session.username : ''
    }); 
};

exports.post_nueva_caricatura = (request, response, next) => {
    console.log('POST /audioVisual/nuevaCaricatura');
    const cari = new Caricaturas(request.body.nombre, request.body.sinopsis,request.body.imagen);
    cari.save().then(() => {
        response.setHeader('Set-Cookie', 'ultima_caricatura='+cari.nombre+'; HttpOnly', 'utf8');
        response.redirect('/audioVisual');
    }).catch(err => console.log(err));
};

exports.principal = (request, response, next) => {
    Peliculas.fetchAllPeliculas()
    .then(([peliculas, fieldData]) => {
        Caricaturas.fetchAllCaricaturas()
        .then(([caricaturas,fieldData]) =>{
            Series.fetchAllSeries()
            .then(([series,fieldData]) =>{
                response.render('listaVisual', {
                    peliculas: peliculas,
                    series:series,
                    caricaturas:caricaturas,
                    username: request.session.username ? request.session.username : '',
                    ultima_pelicula: request.cookies.ultima_pelicula ? request.cookies.ultima_pelicula : '',
                    ultima_serie: request.cookies.ultima_serie ? request.cookies.ultima_serie : '',
                    ultima_caricatura: request.cookies.ultima_caricatura ? request.cookies.ultima_caricatura : ''
                })
            }).catch(error => {
                console.log(error);
            });
        }).catch(error =>{
            console.log(error);
        });
       
    })
    .catch(err => console.log(err)); 
  
        
}


