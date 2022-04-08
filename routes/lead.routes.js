const express = require('express');
const isAuth = require('../util/is-auth.js');
const checkRoleAuth = require('../util/rol-auth.js');
const router = express.Router();

const leadController = require('../controllers/chapterLead_controller');

router.get('/empleados/:idEmpleado',isAuth, checkRoleAuth([1]), leadController.modificarEmpleado);
router.post('/empleados/:idEmpleado',isAuth, checkRoleAuth([1]), leadController.modificarEmpleado);
router.get('/empleados',isAuth, checkRoleAuth([1]), leadController.agregarEmpleados);
router.post('/empleados',isAuth, checkRoleAuth([1]), leadController.guardarEmpleado);


module.exports = router;
