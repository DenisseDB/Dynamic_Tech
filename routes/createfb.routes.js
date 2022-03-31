const express = require('express');
const isAuth = require('../util/is-auth.js');
const checkRoleAuth = require('../util/rol-auth.js');
const router = express.Router();

const createfb = require('../controllers/createfb_controller');

router.get('/generarFormato', isAuth, checkRoleAuth([2]), createfb.generarFormato);
router.get('/buscarFormato/:nivel/:dim', isAuth, checkRoleAuth([2]), createfb.buscarFormato);

router.get('/modificarFormato', isAuth, checkRoleAuth([2]), createfb.modificarFormato);

router.get('/', isAuth, checkRoleAuth([2]), createfb.root);


module.exports = router;