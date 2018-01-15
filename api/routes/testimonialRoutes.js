var express = require('express');
var router = express.Router();
var Testimonial = require('../../models/testimonial');
var verifyToken = require('../../auth/verifyToken');


// save testimonial
router.post('/', verifyToken, function (req, res, next) {
    var testimonial = new Testimonial(req.body);
    testimonial.save()
        .then(function (newTestimonial) {
            res.status(201).json({
                message: "New testimonial created successfully."
            })
        })
        .catch(function (err) {
            res.status(500).json({
                message: err.message
            })
        });
});

// get all categories
router.get('/', verifyToken, function (req, res, next) {
    Testimonial.find({})
        .exec()
        .then(function (testimonials) {
            res.status(200).json({
                count: testimonials.length,
                data: testimonials
            })
        }).catch(function (err) {
        res.status(500).json({
            error: err.message
        })
    });
});

//get categories by id
router.get('/:testimonialId', verifyToken, function (req, res, next) {
    Testimonial.findById(req.params.testimonialId)
        .exec()
        .then(function (testimonial) {
            if (!testimonial) {
                res.status(404).jsonp({
                    "message": "Not found"
                });
            } else {
                res.status(200).jsonp({
                    data: testimonial
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
router.patch('/:testimonialId', verifyToken, function (req, res, next) {
    Testimonial.findOneAndUpdate({'_id': req.params.testimonialId}, {$set: req.body})
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
router.delete('/:testimonialId', verifyToken, function (req, res, next) {
    Testimonial.findByIdAndRemove(req.params.testimonialId)
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