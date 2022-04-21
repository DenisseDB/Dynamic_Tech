const express = require('express');
const isAuth = require('../util/is-auth.js');
const checkRoleAuth = require('../util/rol-auth.js');
const router = express.Router();

const createfb = require('../controllers/createfb_controller');
const modify_fb = require('../controllers/modifycontroller');

router.get('/generarFormato', isAuth, checkRoleAuth([1]), createfb.generarFormato);
router.post('/generarFormato', createfb.generarFormato_post);
router.get('/crearPregunta/:nivel/:dim', checkRoleAuth([1]), createfb.crearPregunta);
router.post('/crearPregunta', createfb.crearPregunta_post);
router.get('/buscarFormato/:nivel/:dim', isAuth, checkRoleAuth([1]), createfb.buscarFormato);
router.get('/', isAuth, checkRoleAuth([1]), createfb.root);



router.get('/modificarFormato', isAuth, checkRoleAuth([1]), modify_fb.modificarFormato);
router.post('/modificarFormato', modify_fb.modificarFormato_post);
router.get('/buscarCuestionario/:nivel/:dim', isAuth, checkRoleAuth([1]), modify_fb.buscarCuestionario);
router.get('/buscarPregunta/:nivel/:dim/:cuest', isAuth, checkRoleAuth([1]), modify_fb.buscarPregunta);




module.exports = router; 