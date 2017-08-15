(function () {
    var express = require('express');
    var mongoose = require('mongoose');

    var Schema = mongoose.Schema;

    // Defines the contents of a Category, in which articles are grouped.
    // The 'name' attribute is displayed in the browser as the title of the
    // category, and the 'description' is displayed below the name on the main
    // page for viewing a category.
    // The 'aboutAuthor' attribute is used in the paragraph below the name of
    // the category in the right-column of both the article-list and
    // article-view pages, and describes me in terms relevant to the given
    // category.
    // The 'private' attribute is used to mark categories which do not contain
    // any public articles, viz. are still under construction, and are only
    // visible on the admin page behind the login.
    // The 'image' attribute is used in the meta tags for SEO.
    var categorySchema = new Schema({
        name: {
            type: String,
            required: true,
            index: { unique: true }
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
        },
        image : {
            type : String,
            default : 'img/favicon.png'
        },
        image_dimensions : {
            width: Number,
            height: Number
        }
    });

    /**
     * Filters out all private categories, and returns the public ones.
     *
     * @returns all the categories in the database which are not private.
     */
    categorySchema.query.public = function onlyPublic() {
        return this.find({private: false});
    };

    /**
     * Searches for categories whose names match the given pattern, which can be
     * a regex string.
     * 
     * @param name The name or regex to match against the name, of the desired
     *             categories.
     * @returns the categories whose name match the given pattern.
     */
    categorySchema.query.byName = function queryByName(name) {
        return this.find({name: new RegExp(name, 'i')});
    };

    /**
     * Searches for categories whose description contains the provided pattern,
     * which can be a regex string.
     *
     * @param description The description or regex to match against the 
     *                    description, of the desired categories.
     * @returns the categories whose descriptions match the given pattern.
     */
    categorySchema.query.byDescription = function (description) {
        return this.find({description: new RegExp(description, 'i')});
    };

    // Export a Category model object, based on the above schema, with the above
    // query functions.
    module.exports.Category = mongoose.model('Category', categorySchema);
})();
