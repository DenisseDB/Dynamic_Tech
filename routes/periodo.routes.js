const express = require('express');
const isAuth = require('../util/is-auth.js');
const checkRoleAuth = require('../util/rol-auth.js');
const router = express.Router();

const periodo = require('../controllers/periodo_controller');

router.get('/generarPeriodo', isAuth, checkRoleAuth([2]),  periodo.generarPeriodo);
//router.get('/buscarPeriodo/:nivel/:dim', isAuth, checkRoleAuth([1]), createfb.buscarPeriodo);
router.get('/', isAuth, checkRoleAuth([2]), periodo.root);


module.exports = router;