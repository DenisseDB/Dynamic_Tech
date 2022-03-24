const express = require('express');
const isAuth = require('../util/is-auth.js');
const checkRoleAuth = require('../util/rol-auth.js');
const router = express.Router();

const feedController = require('../controllers/feed_controller');


router.get('/solicitudesFeedback', isAuth,feedController.solicitudesFeedback);


module.exports = router;