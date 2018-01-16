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
    'addedBy': {type: String},
    'articles': [{
        heading: {
            type: String,
            required: [true, 'Please provide heading for article']
        },
        img: {
            type: String
        },
        seeMoreLink: {
            type: String
        },
        type: {
            type: String
        },
        desc: {
            type: String
        }
    }],
    'others': [{
        heading: {
            type: String,
            required: [true, 'Please provide heading for data']
        },
        img: {
            type: String
        },
        seeMoreLink: {
            type: String
        },
        type: {
            type: String
        },
        desc: {
            type: String
        }
    }],
    'desc': {type: String, required: true},
    'isItFeaturedProduct': {type: Boolean, default: false},
    'mainVideo': {
        title: {
            type: String
        },
        url: {
            type: String
        }
    },
    'coverImage': {
        title: {
            type: String
        },
        url: {
            type: String,
            required: [true, 'Please upload cover image its mandatory.']
        }
    },
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
    'videos': [{
        title: {
            type: String,
            required: [true, 'Video Title is required.'],
        },
        url: {
            type: String
        },
        coverImage: {
            required: [true, 'Cover image is required.'],
            type: String
        }
    }],
    'caseStudies': [
        {
            title: {
                type: String,
                required: [true, 'Case study Title is required.']
            },
            url: {
                type: String
            }
        }
    ],
    'whitePapers': [{
        title: {
            type: String,
            required: [true, 'White paper Title is required.']
        },
        url: {
            type: String
        }
    }],
    'demos': [{
        heading: {
            type: String,
            required: [true, 'Please provide heading for demo']
        },
        img: {
            type: String
        },
        seeMoreLink: {
            type: String
        },
        type: {
            type: String
        },
        desc: {
            type: String
        }
    }],
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
