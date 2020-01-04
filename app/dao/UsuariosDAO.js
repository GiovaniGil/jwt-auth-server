var ConnectionFactory = require('../infra/connectionFactory')

function UsuariosDAO(error) {
    this._connection = ConnectionFactory.connect((err) => error(err));
}

UsuariosDAO.prototype.listar = function (callback, error) {
    this._connection.query('SELECT * FROM usuario ORDER BY id ASC')
        .then(items => callback(items))
        .catch(err => error(err.stack))
        .finally(() => this._connection.end());
}

UsuariosDAO.prototype.buscarPorId = function (id, callback, error) {
    this._connection.query('SELECT * FROM usuario WHERE id = $1', [id])
        .then(items => callback(items))
        .catch(err => error(err.stack))
        .finally(() => this._connection.end());
}

UsuariosDAO.prototype.buscarPorUsuario = function (object, callback, error) {
    this._connection.query('SELECT * FROM usuario WHERE usuario = $1', [object.usuario])
        .then(items => callback(items))
        .catch(err => error(err.stack))
        .finally(() => this._connection.end());
}

UsuariosDAO.prototype.remover = function (id, callback, error) {
    this._connection.query('DELETE FROM usuario WHERE id = $1', [id])
        .then(item => callback(item))
        .catch(err => error(err.stack))
        .finally(() => this._connection.end());
}

UsuariosDAO.prototype.salvar = function (object, callback, error) {

    var query = '';
    if (!object.id) {
        query = `INSERT INTO usuario( 
            "nome", 
            "usuario", 
            "password",  
            "level") VALUES( $1, $2, $3, $4 )  RETURNING *`;
    } else {
        query = `UPDATE usuario SET
        "nome"=$1, 
        "usuario"=$2, 
        "password"=$3,  
        "level"=$4 WHERE id = `+ object.id+'  RETURNING *';
    }

    this._connection.query(query,
        [
            object.nome,
            object.usuario,
            object.password,
            object.level         
        ])
        .then(item => callback(item))
        .catch(err => error(err.stack))
        .finally(() => this._connection.end());
}


module.exports = function (error) {
    return new UsuariosDAO(error);
}
