const express = require('express');
const isAuth = require('../util/is-auth.js');
const checkRoleAuth = require('../util/rol-auth.js');
const router = express.Router();

const createfb = require('../controllers/createfb_controller');
const modify_fb = require('../controllers/modifycontroller');

router.get('/generarFormato', isAuth, checkRoleAuth([2]), createfb.generarFormato);
router.post('/generarFormato', createfb.generarFormato_post);
router.get('/crearPregunta/:nivel/:dim', checkRoleAuth([2]), createfb.crearPregunta);
router.post('/crearPregunta', createfb.crearPregunta_post);
router.get('/buscarFormato/:nivel/:dim', isAuth, checkRoleAuth([2]), createfb.buscarFormato);
router.get('/', isAuth, checkRoleAuth([2]), createfb.root);



router.get('/modificarFormato', isAuth, checkRoleAuth([2]), modify_fb.modificarFormato);
router.post('/modificarFormato', modify_fb.modificarFormato_post);
router.get('/buscarCuestionario/:nivel/:dim', isAuth, checkRoleAuth([2]), modify_fb.buscarCuestionario);
router.get('/buscarPregunta/:nivel/:dim', isAuth, checkRoleAuth([2]), modify_fb.buscarPregunta);





module.exports = router;