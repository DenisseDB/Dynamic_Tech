const express = require('express');
const isAuth = require('../util/is-auth.js');
const checkRoleAuth = require('../util/rol-auth.js');
const router = express.Router();

const feedController = require('../controllers/feed_controller');

router.get('/solicitudes', isAuth, feedController.solicitudesFeedback); // SOLICITUDES - Mis Solicitudes
router.post('/solicitudes', isAuth, feedController.nuevaSolicitud); // SOLICITUDES - Nueva Solicitud
router.get('/mentorados', isAuth, checkRoleAuth([1, 2]), feedController.misMentorados); // MENTORADOS - Assistant, Lead*

router.get('/miFeedback', isAuth, feedController.miFeedback); // FEEDBACK - Mi Feedback
router.post('/miFeedback', isAuth, feedController.detalleFeedback);

router.post('/mentorados/vistaFeedback/:idEmpleado', isAuth, checkRoleAuth([1,2]), feedController.miFeedback_id); // FEEDBACK - Mi Feedback
router.post('/mentorados/detalleFeedback/:idEmpleado', isAuth, feedController.detalleFeedback_id); // FEEDBACK - Mi Feedback

//router.get('/mentorados/vistaFeedback/:idEmpleado', isAuth, checkRoleAuth([1,2]), feedController.miFeedback_id); // FEEDBACK - Mi Feedback
//router.get('/mentorados/detalleFeedback/:idEmpleado', isAuth, feedController.detalleFeedback_id); 

router.get('/responderFeedback/:idEvaluado/:idPeriodo', isAuth,feedController.cuestionario) // CUESTIONARIO - Formulario de feedback
router.post('/responderFeedback/:idEvaluado/:idPeriodo', isAuth, feedController.salvarRespuestas);

router.get('/preguntasFrecuentes', isAuth,feedController.preguntasFrecuentes);

router.get('/home', isAuth, feedController.home); // HOME - Inicio

module.exports = router;