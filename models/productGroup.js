var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');


//Schema for products Group
var productGroupSchema = new Schema({
    'group_name': {type: String, required: [true, 'Group name is required.'], unique: true},
    'img': {type: String, required: [true, 'Image is required.']},
    'hoverImg': {type: String, required: [true, 'On hover which image you want to show will be required.']},
    created_at: Number,
    updated_at: Number
});

productGroupSchema.plugin(autoIncrement.plugin, {
    model: 'ProductGroup',
    field: 'productGroupId',
    startAt: 1,
    incrementBy: 1
});

productGroupSchema.pre('save', function (next) {
    // get the current date
    var currentDate = new Date().getTime();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});


var ProductGroup = mongoose.model('ProductGroup', productGroupSchema);

module.exports = ProductGroup;

