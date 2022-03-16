const express = require('express');
const isAuth = require('../util/is-auth.js');
const router = express.Router();

const userController = require('../controllers/user_controller');

router.get('/login', userController.get_login);
router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.get('/tops', isAuth,userController.tops);
router.get('/signup', userController.get_signup);
router.post('/signup', userController.post_signup);
router.get('/misMentorados', isAuth,userController.misMentorados);

router.get('/', isAuth, userController.root);

module.exports = router;