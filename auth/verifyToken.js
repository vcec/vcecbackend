var jwt = require('jsonwebtoken');
var config = require('../config');

function verifyToken(req, res, next) {
    var token = req.headers['x-access-token'];

    //No authentication token provided.
    if (!token)
        return res.status(403).send({auth: false, message: 'Unauthorized User.'});

    jwt.verify(token, config.secret, function (err, decoded) {
        if (err)
            return res.status(401).send({auth: false, message: 'Unauthorized User.'});
        // if everything good, save to request for use in other routes
        req.userId = decoded.id;
        next();
    });
}

module.exports = verifyToken;