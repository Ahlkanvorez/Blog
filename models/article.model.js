(function () {
    const express = require('express');
    const mongoose = require('mongoose');

    const Schema = mongoose.Schema;

    // Defines the raw contents of an article posted to the database.
    // The 'title' attribute is the actual title displayed in the article-list
    // and at the top of the article-view page.
    // The 'author' attribute encapsulates all information about the person who
    // wrote the article, or the original author from which the article has been
    // copied/reformatted. The author should contain both a name and an email,
    // but if one is not appropriate it may be omitted.
    // The 'date' attribute represents the date the article was first created,
    // and is the primary attribute on which the article-list page sorts the
    // articles.
    // TODO: decide whether it should be the date last edited, first created,
    // TODO: posted, or maybe even a history of edits)
    // The 'category' attribute is simply the name of the category to which the
    // article belongs.
    // The 'content' attribute is a String of the raw HTML for the article,
    // which is injected into the article-view page.
    // The 'sticky' attribute, if true, indicates that the article is to be
    // listed first (or alphabetically amongst the other sticky articles) in the
    // listing of articles of the same category. In the main page, sticky
    // articles take priority in sorting above date.
    // The 'private' attribute is used to mark articles which are still under
    // construction, and are only visible on the admin page behind the login.
    // The 'image' attribute is used in the meta for linking to each article
    // page.
    const articleSchema = new Schema({
        title: String,
        author: { name: String, email: String },
        date: { type: Date, default: Date.now },
        category: { type: String, default: 'Miscellany' },
        content: String,
        sticky: { type: Boolean, default: false },
        private: { type: Boolean, default: true },
        image: { type: String, default: 'img/favicon/png' },
        image_dimensions : { width: Number, height: Number }
    });

    /**
     * Filters out all private articles, returning only public ones.
     *
     * @returns all the articles in the database which are public (not private).
     */
    articleSchema.query.public = function onlyPublic() {
        return this.find({private: false});
    };

    /**
     * Returns the unique article with the provided ID.
     *
     * @param id the id of the desired unique article.
     * @returns the unique article with the provided ID.
     */
    articleSchema.query.byId = function queryById(id) {
        return this.find({_id: id});
    };

    /**
     * Searches for articles whose titles match the given pattern, which can be
     * a regex string.
     *
     * @param title The title or regex to match against the title, of the
     *              desired articles.
     * @returns the articles whose titles match the given pattern.
     */
    articleSchema.query.byTitle = function queryByTitle(title) {
        return this.find({title: new RegExp(title, 'i')});
    };

    /**
     * Searches for articles whose authors' names match the given pattern, which
     * can be a regex string.
     *
     * @param author The author name or regex to match against the author name,
     *               of the desired articles.
     * @returns the articles whose authors' names match the given pattern.
     */
    articleSchema.query.byAuthor = function queryByAuthor(author) {
        return this.find({'author.name': new RegExp(author, 'i')});
    };

    /**
     * Searches for articles which belong to categories whose names match the
     * given pattern, which can be a regex string.
     *
     * @param category The name or regex to match against the name of the
     *                 category, of the desired articles.
     * @returns the articles whose categories match the given pattern.
     */
    articleSchema.query.byCategory = function queryByCategory(category) {
        // Because Miscellany is the default value, it does not appear in the
        // database when find() is executed. Consequently, to check for a
        // document which may have the default value ('Miscellany'), we also
        // have to check for 'undefined'.
        return (category === 'Miscellany')
            ? this.find({
            $or: [
                {category: undefined},
                {category: category}
            ]
        })
            : this.find({category: new RegExp(category, 'i')});
    };

    /**
     * Searches for articles whose dates are between the provided two dates,
     * [start, end), inclusive for start, and exclusive for end.
     *
     * @param start The first date from which the desired articles were posted.
     * @param end The last date before which the desired articles were posted.
     * @returns the articles whose dates are between the provided two dates.
     */
    articleSchema.query.betweenDates = function queryBetweenDates(start, end) {
        return this.find({ date: { "$gte": start, "$lt": end } });
    };

    /**
     * Searches for articles whose content matches the provided regex pattern.
     *
     * @param text The text to search for or regex to match content against, for
     *             the desired article.
     * @returns the articles whose content matches the provided pattern.
     */
    articleSchema.query.byContent = function queryByContent(text) {
        return this.find({ content: new RegExp(text, 'i') });
    };

    // Export an Article model object, based on the above schema, with the above
    // query functions.
    module.exports.Article = mongoose.model('Article', articleSchema);
})();
