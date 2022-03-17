/*module.exports = (rol) => (request, response, next) => {
    // ir de rol en rol para verificar que si haya coincidencia   
    if (!(request.session.idRol == rol)) {
        return response.status(403).redirect('./tops/');
    }
    next();
}*/

module.exports = (roles) => (request, response, next) => {

    let r;
    // ir de rol en rol para verificar que si haya coincidencia   
    for (let rol of roles){
        if (request.session.idRol == rol) {
            r = true; // hay coincidencia con el rol
        }
    }
    
    if (!r){
        return response.status(403).redirect('./tops/');
    }
    next();
}
