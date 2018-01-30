var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
var VerifyToken = require('./verifyToken');
var User = require('../models/user');


router.post('/register', function (req, res) {
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    req.body.password = hashedPassword;
    var user = new User(req.body);

    user.save(req.body).then(function (newUser) {
        if (newUser) {
            // create a token
            var token = jwt.sign({id: newUser._id}, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).json({auth: true, token: token});
        }
    }).catch(function (err) {
        if (err.message.indexOf('duplicate key') != -1) {
            res.status(500).json({
                error: err.message
            })
        } else {
            res.status(500).json({
                error: "User Id already exist."
            })
        }
    });
});


router.get('/me', VerifyToken, function (req, res) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({auth: false, error: 'No token provided.'});

    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) return res.status(500).send({auth: false, error: 'Failed to authenticate token.'});

        User.findById(decoded.id, function (err, user) {
            if (err) return res.status(500).send({error: "There was a problem finding the user."});
            if (!user) return res.status(404).send({error: "No user found."});
            res.status(200).send(user);
        });
    });
});


router.post('/login', function (req, res) {
    User.findOne({userId: req.body.userId}, function (err, user) {
        if (err) return res.status(500).send({error: 'Error on the server.'});
        if (!user) return res.status(404).send({error: 'No user found.'});
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({auth: false, token: null});
        var token = jwt.sign({id: user._id}, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({auth: true, token: token});
    });
});

module.exports = router;
