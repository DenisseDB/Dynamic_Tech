module.exports = (rol) => (request, response, next) => {
    // ir de rol en rol para verificar que si haya coincidencia   
    if (!(request.session.idRol == rol)) {
        return response.status(403).redirect('./tops/');
    }
    next();
}
