var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

//schema for categories
var testimonialSchema = new Schema({
    'userInfo': {
        userName: {
            type: String,
            required: [true, 'Name is required']
        },
        userImg: {
            type: String
        },
        userCompany: {
            type: String,
            required: [true, 'Company name is required']
        }
    },
    'mainText': {type: String, required: [true, "text is required."]},
    'addedBy': {type: String},
    created_at: Number,
    updated_at: Number
});


testimonialSchema.plugin(autoIncrement.plugin, {
    model: 'Testimonial',
    field: 'testimonialId',
    startAt: 1,
    incrementBy: 1
});

testimonialSchema.pre('save', function (next) {
    // get the current date
    var currentDate = new Date().getTime();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

var Testimonial = mongoose.model('Testimonial', testimonialSchema);

module.exports = Testimonial;
