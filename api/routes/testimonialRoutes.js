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
router.get('/', function (req, res, next) {
    if (req.query.page >= 0) {
        var maxRecordInResponse = 2;
        var skipRecords = maxRecordInResponse * req.query.page;
        var totalRecordInDb = 0;

        Testimonial.count({}, function (err, data) {
            if (err == null) {
                totalRecordInDb = data;
                Testimonial.find()
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
        Testimonial.count({}, function (err, data) {
            if (err == null) {
                totalRecordInDb = data;
                Testimonial.find()
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
router.get('/:testimonialId', function (req, res, next) {
    Testimonial.findById(req.params.testimonialId)
        .exec()
        .then(function (testimonial) {
            res.status(200).jsonp({
                data: testimonial
            });
        })
        .catch(function (err) {
            res.status(500).json({
                message: err.message
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
                message: err.message
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
                message: err.message
            })
        })
});

module.exports = router;