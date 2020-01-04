var config = require('../../env.config');
var UsuarioController = require('../controllers/UsuarioController');
var PermissionMiddleware = require('../middlewares/PermissionMiddleware');
var ValidationMiddleware = require('../middlewares/ValidationMiddleware')

const ADMIN = config.permissionLevels.ADMIN;
const PAID = config.permissionLevels.PAID_USER;
const NORMAL_USER = config.permissionLevels.NORMAL_USER;


module.exports = function (app) {

        app.get('/usuario/:id([0-9]+$)',[
        ValidationMiddleware.validJWTNeeded,  
        PermissionMiddleware.minimumPermissionLevelRequired([ADMIN, NORMAL_USER]),
        UsuarioController.findById]);

        app.get("/usuario/all", [
        ValidationMiddleware.validJWTNeeded,  
        PermissionMiddleware.minimumPermissionLevelRequired([ADMIN, NORMAL_USER]),       
        UsuarioController.all]);

        app.post("/usuario/login",[UsuarioController.login]);

        app.post('/usuario/save', [
        ValidationMiddleware.validJWTNeeded,  
        PermissionMiddleware.minimumPermissionLevelRequired([ADMIN]),
        UsuarioController.save]);

        app.delete('/usuario/delete/:id([0-9]+$)', [
        ValidationMiddleware.validJWTNeeded,  
        PermissionMiddleware.minimumPermissionLevelRequired([ADMIN]),
        UsuarioController.delete]);
}
