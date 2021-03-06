const express = require('express');
const isAuth = require('../util/is-auth.js');
const checkRoleAuth = require('../util/rol-auth.js');
const router = express.Router();

const crearPeriodo= require('../controllers/crearPeriodo_controller');
const { route } = require('express/lib/application');

//router.get('/ingresarPeriodos', isAuth, checkRoleAuth([1]), crearPeriodo.generarPeriodo);
router.post('/ingresarPeriodos', crearPeriodo.generarPeriodoPost);

router.get('/', isAuth, checkRoleAuth([1]), crearPeriodo.root);

//router.post('/modificarPeriodo/:id', isAuth, checkRoleAuth([1]), crearPeriodo.modificarPeriodo)
router.get('/modificarPeriodo', isAuth, checkRoleAuth([1]), crearPeriodo.modificarPeriodo);
router.post('/modificarPeriodo', crearPeriodo.modificarPeriodo_post);


module.exports = router;    