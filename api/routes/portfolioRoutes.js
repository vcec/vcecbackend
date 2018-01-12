var express = require('express');
var router = express.Router();
var Portfolio = require('../../models/portfolio');

// save portfolio
router.post('/', function (req, res, next) {
    var portfolio = new Portfolio(req.body);
    portfolio.save()
        .then(function (newPortfolio) {
            res.status(201).json({
                data: newPortfolio
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
        })
});

// get all portfolios
router.get('/', function (req, res, next) {
    Portfolio.find()
        .exec()
        .then(function (portfolios) {
            res.status(200).json({
                count: portfolios.length,
                data: portfolios
            })
        })
        .catch(function (err) {
            res.status(500).json({
                error: err.message
            });
        });
});

//get portfolio by id
router.get('/:portfolioId', function (req, res, next) {
    Portfolio.findById(req.params.portfolioId)
        .exec()
        .then(function (portfolio) {
            if (!portfolio || portfolio.length == 0) {
                res.status(404).jsonp({
                    "message": "Not found"
                });
            } else {
                res.status(200).jsonp({
                    data: portfolio
                });
            }
        })
        .catch(function (err) {
            res.status(500).json({
                error: err.message
            })
        });
});

//get portfolios by product Group
router.get('/group/:groupName', function (req, res, next) {
    var grourpName = req.params.groupName;
    console.log(grourpName);
    Portfolio.find({productGroups: grourpName})
        .exec()
        .then(function (portfolios) {
            if (!portfolios || portfolios.length == 0) {
                res.status(404).jsonp({
                    "message": "Not found"
                });
            } else {
                res.status(200).jsonp({
                    data: portfolios
                });
            }
        })
        .catch(function (err) {
            res.status(500).json({
                error: err.message
            })
        });
});

//get portfolios by category
router.get('/category/:categoryName', function (req, res, next) {
    var grourpName = req.params.categoryName;
    Portfolio.find({solutions: categoryName})
        .exec()
        .then(function (portfolios) {
            if (!portfolios || portfolios.length == 0) {
                res.status(404).jsonp({
                    "message": "Not found"
                });
            } else {
                res.status(200).jsonp({
                    data: portfolios
                });
            }
        })
        .catch(function (err) {
            res.status(500).json({
                error: err.message
            })
        });
});


//update portfolio
router.patch('/:portfolioId', function (req, res, next) {
    Portfolio.findOneAndUpdate({'_id': req.params.portfolioId}, {$set: req.body})
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

//delete portfolio
router.delete('/:portfolioId', function (req, res, next) {
    Portfolio.findByIdAndRemove(req.params.portfolioId)
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