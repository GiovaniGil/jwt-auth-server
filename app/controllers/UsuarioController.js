var jwt = require('jsonwebtoken');
var config = require('../../env.config');
var UsuariosDAO = require('../dao/UsuariosDAO')
var bcrypt = require('bcryptjs');

exports.all = (req, res, next) => {

    var usuariosDAO = new UsuariosDAO((err) => res.status(500).json(`Erro ao conectar com banco de dados: ${err}`));
    usuariosDAO.listar(
        (items) => {
            res.status(200).json(items.rows);
        },
        (error) => {
            res.status(500).json(error);
        });	
}

exports.save = (req, res, next) => {
    var usuario = req.body;
    usuario.password = bcrypt.hashSync(req.body.password, 8);
    var usuariosDAO = new UsuariosDAO((err) => res.status(500).json(`Erro ao conectar com banco de dados: ${err}`));      

    usuariosDAO.salvar(usuario,
        (item) => {
            var token = jwt.sign({ id: item.rows[0].id, level: item.rows[0].level  }, config.jwt_secret, {
                expiresIn: config.jwt_expiration_in_seconds
              });
            res.status(200).send({ auth: true, token: token });
        },
        (error) => {
            res.status(500).json(error);
        });
}

exports.delete = (req, res) => {
    if (!isNaN(req.params.id)) {
        var usuariosDAO = new UsuariosDAO((err) => res.status(500).json(`Erro ao conectar com banco de dados: ${err}`));
        usuariosDAO.remover(req.params.id,
            (item) => {
                res.status(200).json({ affectedRows: item.rowCount });
            },
            (error) => {
                res.status(500).json(error);
            });
    }
    else
        res.status(400).json({ message: 'Parâmetro inválido' });;
}

exports.login =  (req, res, next) => {
    var usuarioReq = req.body;
    var usuariosDAO = new UsuariosDAO((err) => res.status(500).json(`Erro ao conectar com banco de dados: ${err}`));
    
    usuariosDAO.buscarPorUsuario(usuarioReq,
        (item) => {
            if (item.rowCount > 0) {
                let usuario = item.rows[0];
                var passwordIsValid = bcrypt.compareSync(usuarioReq.password, usuario.password);
                if (!passwordIsValid) 
                    return res.status(401).send({ auth: false, token: null });

                var token = jwt.sign({ id: usuario.id, level: usuario.level }, config.jwt_secret, {
                    expiresIn: config.jwt_expiration_in_seconds
                    });
                    
                res.status(200).send({ auth: true, token: token });

            }
            else
                res.status(404).json({msg: "Usuário não encontrado"});
        },
        (error) => {
            res.status(500).json(error);
        });    
}

exports.findById = (req, res) => {
    if (!isNaN(req.params.id)) {
        var usuariosDAO = new UsuariosDAO((err) => res.status(500).json(`Erro ao conectar com banco de dados: ${err}`));
        usuariosDAO.buscarPorId(req.params.id,
            (items) => {
                if (items.rowCount > 0)
                    res.status(200).json(items.rows[0]);
                else
                    res.status(200).json({});
            },
            (error) => {
                res.status(500).json(error);
            });
    }
    else
        res.status(400).json({ message: 'Parâmetro inválido' });
}