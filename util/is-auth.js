// verificar que este loggeado
module.exports = (request, response, next) => {
    if (!request.session.isLoggedIn) { // mandamos lo que tenemos en session para plasmar los mentorados
        return response.status(403).redirect('/users/login');
    }
    next();
}