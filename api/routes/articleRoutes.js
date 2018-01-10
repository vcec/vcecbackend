var express = require('express');
var router = express.Router();
var Article = require('../../models/article');

// save articles
router.post('/', function (req, res, next) {
    var Article = new Article(req.body);
    Article.save()
        .then(function (newArticle) {
            res.status(201).json({
                message: "New article created successfully."
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
    Article.find({})
        .exec()
        .then(function (articles) {
            res.status(200).json({
                count: articles.length,
                data: articles
            })
        }).catch(function (err) {
        res.status(500).json({
            error: err.message
        })
    });
});

//get categories by id
router.get('/:articleId', function (req, res, next) {
    Article.findById(req.params.articleId)
        .exec()
        .then(function (article) {
            if (!article) {
                res.status(404).jsonp({
                    "message": "Not found"
                });
            } else {
                res.status(200).jsonp({
                    data: article
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
router.patch('/:articleId', function (req, res, next) {
    Article.findOneAndUpdate({'_id': req.params.articleId}, {$set: req.body})
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
router.delete('/:articleId', function (req, res, next) {
    Article.findByIdAndRemove(req.params.articleId)
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