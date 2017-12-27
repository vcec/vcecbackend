var express = require('express');
var router = express.Router();
var Category = require('../../models/categories');

// save categories
router.post('/', function (req, res, next) {
    var category = new Category(req.body);
    category.save()
        .then(function (newCategory) {
            res.status(201).json({
                message: "New category created successfully."
            })
        })
        .catch(function (err) {
            res.status(500).json({
                message: err.message
            })
        });
});

// get all categories
router.get('/', function (req, res, next) {
    Category.find({})
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
    Category.findById(req.params.categoryId)
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

//update categories
router.patch('/:categoryId', function (req, res, next) {
    Category.findOneAndUpdate({'_id': req.params.categoryId}, {$set: req.body})
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
router.delete('/:categoryId', function (req, res, next) {
    Category.findByIdAndRemove(req.params.categoryId)
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