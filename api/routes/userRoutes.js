var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var md5 = require('md5');

//api to create new user
router.post('/signUp', function (req, res, next) {
    req.body.password = md5(req.body.password);
    var user = new User(req.body);

    user.save(req.body).then(function (newUser) {
        if (newUser) {
            res.status(201).json(newUser);
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

//api for user login
router.post('/login', function (req, res, next) {
    var password = md5(req.body.password);
    User.find({userId: req.body.userName})
        .exec()
        .then(function (user) {
            if (user.length == 0) {
                res.status(404).json({
                    error: "User Not found with given username."
                });
            } else if (user[0].password != password) {
                res.status(401).json({
                    error: "Incorrect Password."
                });
            } else if (user[0].password == password) {
                res.status(200).json({
                    message: "Success."
                });
            }
        }).catch(function (err) {
        res.status(500).json({
            error: err.message
        });
    });
});

module.exports = router;