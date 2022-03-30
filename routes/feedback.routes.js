const express = require('express');
const isAuth = require('../util/is-auth.js');
const checkRoleAuth = require('../util/rol-auth.js');
const router = express.Router();

const feedController = require('../controllers/feed_controller');

router.get('/home', isAuth, feedController.home); // HOME - Inicio
router.get('/solicitudes', isAuth, feedController.solicitudesFeedback); // SOLICITUDES - Responder/Solicitar feedback
router.get('/mentorados', isAuth, checkRoleAuth([1,2]), feedController.misMentorados); // MENTORADOS - Assistant, Lead*
router.get('/cuestionario/:idEvaluado/:idPeriodo', isAuth, feedController.cuestionario) // CUESTIONARIO - Formulario de feedback

module.exports = router;