var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');


//schema for categories
var articleSchema = new Schema({
    'heading': {type: String, required: [true, "Heading is required."]},
    'desc': {type: String},
    'img': {type: String, required: [true, 'Image is required.']},
    'type': {type: String},
    'seeMoreLink': {type: String},
    created_at: Number,
    updated_at: Number
});


articleSchema.plugin(autoIncrement.plugin, {
    model: 'Article',
    field: 'articleId',
    startAt: 1,
    incrementBy: 1
});

articleSchema.pre('save', function (next) {
    // get the current date
    var currentDate = new Date().getTime();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

var Article = mongoose.model('Article', articleSchema);

module.exports = Article;
