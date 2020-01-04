var jwt = require('jsonwebtoken');
var config = require('../../env.config');

exports.validJWTNeeded = (req, res, next) => {

    try {
        var token = req.headers['x-access-token'];
        if (!token) 
            return res.status(401).send({ auth: false, message: 'No token provided.' });

        jwt.verify(token, config.jwt_secret, function(err, decoded) {
            if (err) 
                return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
            
            req.jwt = decoded;                
            return next();
        });          

    } catch (err) {
        return res.status(403).send();
    }
}; 