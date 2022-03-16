const path = require('path');
const Artistas = require('../models/musica/artistas');
const Bandas = require('../models/musica/bandas');

const artistas = [];
const bandas = [];


exports.get_nuevo_artista = (request, response, next) => {
    Artistas.fetchAllArtistas()
        .then(([rows, fieldData]) => {
            response.render('nuevoArtista', {
                series: rows,
                username: request.session.username ? request.session.username : '',
            })
        })
        .catch(err => console.log(err));
};

exports.post_nuevo_artista = (request, response, next) => {
    const artista = new Artistas(request.body.nombre, request.body.sinopsis,request.body.imagen);
    artista.save().then(() => {
        response.setHeader('Set-Cookie', 'ultimo_Artista='+artista.nombre+'; HttpOnly', 'utf8');
        response.redirect('/musica');
    }).catch(err => console.log(err));
};

exports.get_nueva_banda = (request, response, next) => {
    console.log('GET /musica/nuevaBanda');
    // response.render('nuevaBanda', {
    //     username: request.session.username ? request.session.username : ''
    // });
    Bandas.fetchAllBandas()
        .then(([rows, fieldData]) => {
            response.render('nuevaBanda', {
                bandas: rows,
                username: request.session.username ? request.session.username : '',
            })
        })
        .catch(err => console.log(err));
};

exports.post_nueva_banda = (request, response, next) => {
    const banda = new Bandas(request.body.nombre, request.body.sinopsis,request.body.imagen);
    banda.save().then(() => {
        response.setHeader('Set-Cookie', 'ultimo_Artista='+banda.nombre+'; HttpOnly', 'utf8');
        response.redirect('/musica');
    }).catch(err => console.log(err));
};


exports.principal = (request, response, next) => {
    console.log('Ruta principal Música');
    Artistas.fetchAllArtistas()
        .then(([artistas, fieldData]) => {
            Bandas.fetchAllBandas()
            .then(([bandas,fieldData]) => {
                response.render('listaMusica', {
                    artistas: artistas,
                    bandas:bandas,
                    username: request.session.username ? request.session.username : '',
                    ultimo_artista: request.cookies.ultimo_artista ? request.cookies.ultimo_artista : '',
                    ultima_banda: request.cookies.ultima_banda ? request.cookies.ultima_banda : ''
                })
            }).catch(error => {
                console.log(error);
            });
        }).catch(error =>{
            console.log(error);
        });
    }