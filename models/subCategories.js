var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

//schema for categories
var productSubCategorySchema = new Schema({
    'name': {type: String, required: [true, "Sub Category name is required."], unique: true},
    'img': {type: String},
    'mainCategory': {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductCategory',
        required: [true, "Main category is required."]
    },
    created_at: Number,
    updated_at: Number
});


productSubCategorySchema.plugin(autoIncrement.plugin, {
    model: 'ProductSubCategory',
    field: 'subCategoryId',
    startAt: 1,
    incrementBy: 1
});

productSubCategorySchema.pre('save', function (next) {
    // get the current date
    var currentDate = new Date().getTime();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

var ProductSubCategory = mongoose.model('ProductSubCategory', productSubCategorySchema);

module.exports = ProductSubCategory;
