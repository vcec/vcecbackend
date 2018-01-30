var express = require('express');
var router = express.Router();
var Group = require('../../models/productGroup');
var multer = require('multer');
var verifyToken = require('../../auth/verifyToken');


// save group
router.post('/', verifyToken, function (req, res, next) {
    var group = new Group(req.body);
    group.save()
        .then(function (newGroup) {
            res.status(201).json({
                message: "New group created successfully."
            })
        })
        .catch(function (err) {
            if (err.message.indexOf('duplicate key') != -1) {
                res.status(500).json({
                    message: "Group with same name already exist."
                })
            } else {
                res.status(500).json({
                    message: err.message
                })
            }
        });
});

// get all groups
router.get('/', function (req, res, next) {
    Group.find({})
        .exec()
        .then(function (groups) {
            res.status(200).json({
                count: groups.length,
                data: groups
            })
        }).catch(function (err) {
        res.status(500).json({
            message: err.message
        })
    });
});

//get group by id
router.get('/:groupId', function (req, res, next) {
    Group.findById(req.params.groupId)
        .exec()
        .then(function (group) {

            res.status(200).jsonp({
                data: group
            });

        })
        .catch(function (err) {
            res.status(500).json({
                message: err.message
            })
        });
});

//get group by id
router.get('/groupName/:groupName', function (req, res, next) {
    Group.findOne({"group_name": req.params.groupName})
        .exec()
        .then(function (group) {

            res.status(200).jsonp({
                data: group
            });

        })
        .catch(function (err) {
            res.status(500).json({
                message: err.message
            })
        });
});


//update group
router.patch('/:groupId', verifyToken, function (req, res, next) {
    Group.findOneAndUpdate({'_id': req.params.groupId}, {$set: req.body})
        .exec()
        .then(function (response) {
            res.status(201).json({
                message: "Updated Successfully",
                data: response
            });
        })
        .catch(function (err) {
            res.status(500).json({
                message: err.message
            })
        })
});

//delete group
router.delete('/:groupId', verifyToken, function (req, res, next) {
    Group.findByIdAndRemove(req.params.groupId)
        .exec()
        .then(function (response) {
            res.status(200).jsonp({
                message: "Deleted successfully."
            });
        })
        .catch(function (err) {
            res.status(500).json({
                message: err.message
            })
        })
});

module.exports = router;