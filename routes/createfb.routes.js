const express = require('express');
const isAuth = require('../util/is-auth.js');
const checkRoleAuth = require('../util/rol-auth.js');
const router = express.Router();

const create_fb = require('../controllers/createfb_controller');
const modify_fb = require('../controllers/modifycontroller');


router.get('/generarFormato', isAuth, checkRoleAuth([2]), create_fb.generarFormato);
router.get('/buscarFormato/:nivel/:dim', isAuth, checkRoleAuth([2]), create_fb.buscarFormato);

router.get('/modificarFormato', isAuth, checkRoleAuth([2]), modify_fb.modificarFormato_Cuestionario);

router.get('/', isAuth, checkRoleAuth([2]), create_fb.root);


module.exports = router;