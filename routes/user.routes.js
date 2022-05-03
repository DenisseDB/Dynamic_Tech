const express = require('express');
const isAuth = require('../util/is-auth.js');
const checkRoleAuth = require('../util/rol-auth.js');
const router = express.Router();

const userController = require('../controllers/user_controller');


router.get('/login', userController.get_login);
router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.get('/tops/:id', isAuth, userController.tops_id);
router.get('/signup', userController.get_signup);
router.post('/signup', userController.post_signup);
router.get('/', isAuth, userController.root);

// Mover a feed (rutas del usuario sesionado).
//router.get('/tops', isAuth,userController.tops); HOME
//router.get('/misMentorados', isAuth, checkRoleAuth([1,2]), userController.misMentorados); MENTORADOS

module.exports = router;