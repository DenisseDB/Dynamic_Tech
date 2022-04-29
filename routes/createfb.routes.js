const express = require('express');
const isAuth = require('../util/is-auth.js');
const checkRoleAuth = require('../util/rol-auth.js');
const router = express.Router();

const createfb = require('../controllers/createfb_controller');
const modify_fb = require('../controllers/modifycontroller');

router.get('/editarCuestionario/:id/:nivel/:dim/:nombre', isAuth, checkRoleAuth([1]), createfb.editarCuestionario);
router.post('/editarCuestionario/:id/:nivel/:dim/:nombre', createfb.editarCuestionario_post);

router.get('/verCuestionario/:id', isAuth, checkRoleAuth([1]), createfb.verCuestionario);

router.get('/crearPregunta/:id/:nivel/:dim/:nombre', isAuth, checkRoleAuth([1]), createfb.crearPregunta);
router.post('/crearPregunta/:id/:nivel/:dim/:nombre', createfb.crearPregunta_post);




router.get('/', isAuth, checkRoleAuth([1]), createfb.root);



/*router.get('/modificarFormato', isAuth, checkRoleAuth([1]), createfb.modificarFormato);
router.post('/modificarFormato', createfb.modificarFormato_post);
router.get('/buscarCuestionario/:nivel/:dim', isAuth, checkRoleAuth([1]), createfb.buscarCuestionario);
router.get('/buscarPregunta/:nivel/:dim/:cuest', isAuth, checkRoleAuth([1]), createfb.buscarPregunta);*/




module.exports = router; 