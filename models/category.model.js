(function () {
    var express = require('express');
    var mongoose = require('mongoose');

    var Schema = mongoose.Schema;

    /* Define the contents of a Category, in which articles are grouped. */
    var categorySchema = new Schema({
        name: {
            type: String,
            required: true,
            index: {unique: true}
        },
        description: {
            type: String,
            required: true
        },
        aboutAuthor: {
            type: String,
            required: true
        },
        private: {
            type: Boolean,
            default: true
        }
    });

    categorySchema.query.public = function onlyPublic() {
        return this.find({private: false});
    }

    categorySchema.query.byName = function queryByName(name) {
        return this.find({name: new RegExp(name, 'i')});
    };

    categorySchema.query.byDescription = function queryByDescription(description) {
        return this.find({description: new RegExp(description, 'i')});
    };

    module.exports.Category = mongoose.model('Category', categorySchema);
})();