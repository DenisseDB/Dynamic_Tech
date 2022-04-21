const express = require('express');
const isAuth = require('../util/is-auth.js');
const checkRoleAuth = require('../util/rol-auth.js');
const router = express.Router();

const createfb = require('../controllers/createfb_controller');
const modify_fb = require('../controllers/modifycontroller');

router.get('/generarFormato', isAuth, checkRoleAuth([1]), createfb.generarFormato);
router.post('/generarFormato', createfb.generarFormato_post);
router.get('/crearPregunta/:nombre/:nivel/:dim', checkRoleAuth([1]), createfb.crearPregunta1);
router.get('/crearPregunta/:nombre/:nivel/:dim/:pregunta0', checkRoleAuth([1]), createfb.crearPregunta2);
router.get('/crearPregunta/:nombre/:nivel/:dim/:pregunta0/:pregunta1', checkRoleAuth([1]), createfb.crearPregunta3);
router.get('/crearPregunta/:nivel/:dim/:pregunta0/:pregunta1/:pregunta2', checkRoleAuth([1]), createfb.crearPregunta4);
router.post('/crearPregunta', createfb.crearPregunta_post);
router.get('/buscarFormato/:nivel/:dim', isAuth, checkRoleAuth([1]), createfb.buscarFormato);
router.get('/', isAuth, checkRoleAuth([1]), createfb.root);



router.get('/modificarFormato', isAuth, checkRoleAuth([1]), createfb.modificarFormato);
router.post('/modificarFormato', createfb.modificarFormato_post);
router.get('/buscarCuestionario/:nivel/:dim', isAuth, checkRoleAuth([1]), createfb.buscarCuestionario);
router.get('/buscarPregunta/:nivel/:dim/:cuest', isAuth, checkRoleAuth([1]), createfb.buscarPregunta);




module.exports = router; 