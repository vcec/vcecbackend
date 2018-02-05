var express = require('express');
var router = express.Router();
var Category = require('../../models/categories');
var verifyToken = require('../../auth/verifyToken');


// save categories
router.post('/', verifyToken, function (req, res, next) {
    var category = new Category(req.body);
    category.save()
        .then(function (newCategory) {
            res.status(201).json({
                message: "New category created successfully."
            })
        })
        .catch(function (err) {
            if (err.message.indexOf('duplicate key') != -1) {
                res.status(500).json({
                    message: "Category with same name already exist."
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
    if (req.query.page >= 0) {
        var maxRecordInResponse = 10;
        var skipRecords = maxRecordInResponse * req.query.page;
        var totalRecordInDb = 0;

        Category.count({}, function (err, data) {
            if (err == null) {
                totalRecordInDb = data;
                Category.find()
                    .skip(skipRecords)
                    .limit(maxRecordInResponse)
                    .exec()
                    .then(function (records) {
                        res.status(200).json({
                            count: records.length,
                            data: records,
                            totalRecords: totalRecordInDb
                        })
                    })
                    .catch(function (err) {
                        res.status(500).json({
                            message: err.message
                        });
                    });
            } else {
                res.status(500).json({
                    message: err.message
                });
            }
        });
    } else {
        Category.count({}, function (err, data) {
            if (err == null) {
                totalRecordInDb = data;
                Category.find()
                    .exec()
                    .then(function (records) {
                        res.status(200).json({
                            count: records.length,
                            data: records,
                            totalRecords: totalRecordInDb
                        })
                    })
                    .catch(function (err) {
                        res.status(500).json({
                            message: err.message
                        });
                    });
            } else {
                res.status(500).json({
                    message: err.message
                });
            }
        });
    }
});

//get categories by id
router.get('/:categoryId', function (req, res, next) {
    Category.findById(req.params.categoryId)
        .exec()
        .then(function (category) {
            res.status(200).jsonp({
                data: category
            });
        })
        .catch(function (err) {
            res.status(500).json({
                error: err.message
            })
        });
});

//get categories by catName
router.get('/categoryName/:catName', function (req, res, next) {
    Category.findOne({'category_name': req.params.catName})
        .exec()
        .then(function (category) {
            res.status(200).jsonp({
                data: category
            });
        })
        .catch(function (err) {
            res.status(500).json({
                error: err.message
            })
        });
});


//update categories
router.patch('/:categoryId', verifyToken, function (req, res, next) {
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
router.delete('/:categoryId', verifyToken, function (req, res, next) {
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