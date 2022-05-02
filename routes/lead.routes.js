const express = require('express');
const isAuth = require('../util/is-auth.js');
const checkRoleAuth = require('../util/rol-auth.js');
const router = express.Router();

const leadController = require('../controllers/chapterLead_controller');



router.get('/empleados/buscarEmpleado/:valor', isAuth,checkRoleAuth([1]), leadController.buscarEmpleado);


router.post('/empleados/eliminar/:idEmpleado',isAuth, checkRoleAuth([1]), leadController.eliminarEmpleado);

router.post('/empleados/feedback/:idEmpleado',isAuth, checkRoleAuth([1]), leadController.feedbackEmpleado);
router.post('/empleados/detallefeedback/:idEmpleado',isAuth, checkRoleAuth([1]), leadController.detalleEmpleado);

router.get('/empleados/:idEmpleado',isAuth, checkRoleAuth([1]), leadController.modificarEmpleado);
router.post('/empleados/:idEmpleado',isAuth, checkRoleAuth([1]), leadController.empleadoModificado);

router.get('/empleados',isAuth, checkRoleAuth([1]), leadController.agregarEmpleados);
router.post('/empleados',isAuth, checkRoleAuth([1]), leadController.guardarEmpleado);

router.get('/miChapter/feedback', isAuth,checkRoleAuth([1]), leadController.respondidas);

router.get('/miChapter/agregarMentor', isAuth,checkRoleAuth([1]), leadController.agregarMentor);
router.post('/miChapter/agregarMentor', isAuth,checkRoleAuth([1]), leadController.agregarNuevoMentor);

router.post('/miChapter/eliminarMentor/:idMentor', isAuth,checkRoleAuth([1]), leadController.eliminarMentor);


//Para modificar mentor 
router.get('/miChapter/modificarMentor/:idMentor',isAuth, checkRoleAuth([1]), leadController.modificarMentor);
router.post('/miChapter/modificarMentor/:idMentor',isAuth, checkRoleAuth([1]), leadController.mentorModificado);
router.post('/miChapter/eliminarMentorado/:idMentor/:idMentorado',isAuth, checkRoleAuth([1]), leadController.eliminarMentorado);


router.get('/miChapter',isAuth, checkRoleAuth([1]), leadController.miChapter);







module.exports = router;
