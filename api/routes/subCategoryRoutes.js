var express = require('express');
var router = express.Router();
var SubCategory = require('../../models/subCategories');
var verifyToken = require('../../auth/verifyToken');


// save categories
router.post('/', verifyToken, function (req, res, next) {
    var subCategory = new SubCategory(req.body);
    subCategory.save()
        .then(function (newCategory) {
            res.status(201).json({
                message: "New sub category created successfully."
            })
        })
        .catch(function (err) {
            if (err.message.indexOf('duplicate key') != -1) {
                res.status(500).json({
                    error: err.message
                })
            } else {
                res.status(500).json({
                    message: err.message
                })
            }
        });
});

// get all categories
router.get('/', function (req, res, next) {
    SubCategory.find({})
        .exec()
        .then(function (categories) {
            res.status(200).json({
                count: categories.length,
                data: categories
            })
        }).catch(function (err) {
        res.status(500).json({
            error: err.message
        })
    });
});

//get categories by id
router.get('/:categoryId', function (req, res, next) {
    SubCategory.findById(req.params.categoryId)
        .exec()
        .then(function (category) {
            if (!category) {
                res.status(404).jsonp({
                    "message": "Not found"
                });
            } else {
                res.status(200).jsonp({
                    data: category
                });
            }
        })
        .catch(function (err) {
            res.status(500).json({
                error: err.message
            })
        });
});

//get all categories by main category id
router.get('/mainCategory/:mainCategoryId', function (req, res, next) {
    SubCategory.find({"mainCategory": req.params.mainCategoryId})
        .exec()
        .then(function (categories) {
            if (!categories || categories.length == 0) {
                res.status(404).jsonp({
                    "message": "Not found"
                });
            } else {
                res.status(200).jsonp({
                    data: categories
                });
            }
        })
        .catch(function (err) {
            res.status(500).json({
                error: err.message
            })
        });
});

//update categories
router.patch('/:categoryId', verifyToken, function (req, res, next) {
    SubCategory.findOneAndUpdate({'_id': req.params.categoryId}, {$set: req.body})
        .exec()
        .then(function (response) {
            res.status(201).json({
                message: "Updated Successfully",
                data: response
            });
        })
        .catch(function (err) {
            res.status(500).json({
                error: err.message
            })
        })
});

//delete categories
router.delete('/:categoryId', verifyToken, function (req, res, next) {
    SubCategory.findByIdAndRemove(req.params.categoryId)
        .exec()
        .then(function (response) {
            res.status(200).jsonp({
                message: "Deleted successfully."
            });
        })
        .catch(function (err) {
            res.status(500).json({
                error: err.message
            })
        })
});

module.exports = router;