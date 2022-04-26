const express = require('express');
const isAuth = require('../util/is-auth.js');
const checkRoleAuth = require('../util/rol-auth.js');
const router = express.Router();

const leadController = require('../controllers/chapterLead_controller');



router.get('/empleados/buscarEmpleado/:valor', isAuth,checkRoleAuth([1]), leadController.buscarEmpleado);

// router.get('/empleados/obten/:idEmpleado',isAuth, checkRoleAuth([1]), leadController.obtenEliminado);
router.post('/empleados/eliminar/:idEmpleado',isAuth, checkRoleAuth([1]), leadController.eliminarEmpleado);

router.get('/empleados/:idEmpleado',isAuth, checkRoleAuth([1]), leadController.modificarEmpleado);
router.post('/empleados/:idEmpleado',isAuth, checkRoleAuth([1]), leadController.empleadoModificado);

router.get('/empleados',isAuth, checkRoleAuth([1]), leadController.agregarEmpleados);
router.post('/empleados',isAuth, checkRoleAuth([1]), leadController.guardarEmpleado);

router.get('/miChapter/feedback', isAuth, leadController.respondidas);
router.get('/miChapter',isAuth, checkRoleAuth([1]), leadController.miChapter);






module.exports = router;
