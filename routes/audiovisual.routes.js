const express = require('express');
const isAuth = require('../util/is-auth');
const router = express.Router();

const visualController = require('../controllers/audioVisual_controller');

//Para películas
router.get('/nuevaPeli', isAuth,visualController.get_nueva_peli);
router.post('/nuevaPeli', visualController.post_nueva_peli);
router.get('/:idPelicula', isAuth,visualController.getPelicula);

//Para series
router.get('/nuevaSerie', isAuth,visualController.get_nueva_serie);
router.post('/nuevaSerie', visualController.post_nueva_serie);

//Para caricaturas
router.get('/nuevaCaricatura', isAuth,visualController.get_nueva_caricatura);
router.post('/nuevaCaricatura', visualController.post_nueva_caricatura);

router.use('/', isAuth,visualController.principal);

module.exports = router;