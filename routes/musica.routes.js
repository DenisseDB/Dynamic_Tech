const express = require('express');
const isAuth = require('../util/is-auth');
const router = express.Router();

const visualController = require('../controllers/musica_controller');

//Para artistas
router.get('/nuevoArtista',isAuth, visualController.get_nuevo_artista);
router.post('/nuevoArtista', visualController.post_nuevo_artista);

//Para bandas
router.get('/nuevaBanda',isAuth, visualController.get_nueva_banda);
router.post('/nuevaBanda', visualController.post_nueva_banda);

router.use('/', isAuth,visualController.principal);

module.exports = router;