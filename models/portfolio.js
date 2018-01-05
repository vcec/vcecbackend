var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');


function validateUrl(arr) {
    if (!Array.isArray(arr)) return false;
    return arr.every(function (val) {
        return /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z0-9]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi.test(val);
    })
}

function validateLink(link) {
    return /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[A-Za-z0-9]+([\-\.]{1}[A-Za-z0-9]+)*\.[A-Za-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gi.test(link);
}

//schema for portfolios
var portfolioSchema = new Schema({
    'title': {type: String, required: true, unique: true},
    'subtitle': {type: String, required: true},
    'productGroups': {type: [String], required: true},
    'solutions': {type: [String], required: true},
    'subSolutions': {type: [String]},
    'desc': {type: String, required: true},
    'isItFeaturedProduct': {type: Boolean, default: false},
    'imgIfFeaturedProduct': {
        type: String
    },
    'detailInfoUrlIfFeaturedProduct': {
        type: String,
        validate: {
            validator: validateLink,
            message: "Please provide valid detail info url."
        }
    },
    'images': {
        type: [String],
        required: true,
        validate: {
            validator: validateUrl,
            message: "Please provide valid Image Urls."
        }
    },
    'videos': {
        type: [String], required: true,
        validate: {
            validator: validateUrl,
            message: "Please provide valid video Urls."
        }
    },
    'caseStudies': {
        type: [String],
        validate: {
            validator: validateUrl,
            message: "Please provide valid case studies Urls."
        }
    },
    'whitePapers': {
        type: [String],
        validate: {
            validator: validateUrl,
            message: "Please provide valid white papers Urls."
        }
    },
    'demoUrl': {
        type: String,
        validate: {
            validator: validateLink,
            message: "Please provide valid demo links."
        }
    },
    created_at: Number,
    updated_at: Number
});

portfolioSchema.plugin(autoIncrement.plugin, {
    model: 'Portfolio',
    field: 'portfolioId',
    startAt: 1,
    incrementBy: 1
});

portfolioSchema.pre('save', function (next) {
    // get the current date
    var currentDate = new Date().getTime();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

var Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
