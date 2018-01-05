var express = require('express');
var multer = require('multer');
var router = express.Router();

var storageForImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/images');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

var storageForVideos = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/videos')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

var storageForPdf = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/pdf')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

var validImageTypes = ['image/png', 'image/jpg', 'image/jpeg'];
var validVideoTypes = ['video/mp4', 'video/ogg'];

var imageUploader = multer({
    storage: storageForImage,
    fileFilter: function (req, file, cb) {
        if (validImageTypes.indexOf(file.mimetype) == -1) {
            return cb('Only image files are allowed', false);
        }
        cb(null, true);
    }
});

var videoUploader = multer({
    storage: storageForVideos,
    fileFilter: function (req, file, cb) {
        if (validVideoTypes.indexOf(file.mimetype) == -1) {
            return cb('Only mp4/ogg type of videos are allowed', false);
        }
        cb(null, true);
    }
});

var pdfUploader = multer({
    storage: storageForPdf,
    fileFilter: function (req, file, cb) {
        if (file.mimetype != 'application/pdf') {
            return cb('Only pdf files are allowed', false);
        }
        cb(null, true);
    }
});

var uploadImageFile = imageUploader.any();
var uploadVideoFile = videoUploader.any();
var uploadPdfFile = pdfUploader.any();

//api to create groups
router.post('/uploadImage', function (request, response) {
    uploadImageFile(request, response, function (err) {
        if (err) {
            // An error occurred when uploading
            response.status(500).json({
                data: err.message
            })
        }
        response.status(200).json({
            data: {
                urlPath: "images/" + request.files[0].filename
            }
        });
    });
});


//api to video type
router.post('/uploadVideo', function (request, response) {
    uploadVideoFile(request, response, function (err) {
        if (err) {
            // An error occurred when uploading
            response.status(500).json({
                data: err.message
            })
        }
        response.status(200).json({
            data: {
                urlPath: "videos/" + request.files[0].filename
            }
        });
    });
});

//api to pdf type
router.post('/uploadPdf', function (request, response) {
    uploadPdfFile(request, response, function (err) {
        if (err) {
            // An error occurred when uploading
            response.status(500).json({
                data: err.message
            })
        }
        response.status(200).json({
            data: {
                urlPath: "pdf/" + request.files[0].filename
            }
        });
    });
});

module.exports = router;