(function () {
  var express = require('express');
  var mongoose = require('mongoose');

  var Schema = mongoose.Schema;

  /* Define the raw contents of an article posted to the database. */
  var articleSchema = new Schema({
    title : String,
    author : { name : String, email : String },
    date : { type : Date, default : Date.now },
    category : {type : String, default : 'Miscellany' },
    content : String,
    sticky : { type : Boolean, default : false },
    private : { type : Boolean, default : true },
  });

  articleSchema.query.public = function onlyPublic () {
    return this.find({ private : false });
  }

  articleSchema.query.byId = function queryById (id) {
    return this.find({ _id : id });
  };

  articleSchema.query.byTitle = function queryByTitle (title) {
    return this.find({ title : new RegExp(title, 'i') });
  };

  articleSchema.query.byAuthor = function queryByAuthor (author) {
    return this.find({ 'author.name' : new RegExp(author, 'i') });
  };

  articleSchema.query.byCategory = function queryByCategory (category) {
    /* Because Miscellany is the default value, it does not appear in the
          database when find() is executed. Consequently, to check for a
          document which may have the default value ('Miscellany'), we also
          have to check for 'undefined'.*/
    return (category === 'Miscellany')
        ? this.find({ $or : [
            { category : undefined },
            { category : category }
          ]})
        : this.find({ category : new RegExp(category, 'i') });
  };

  articleSchema.query.betweenDates = function queryBetweenDates (start, end) {
    return this.find({ date : { "$gte" : start, "$lt" : end } });
  };

  articleSchema.query.byContent = function queryByContent (text) {
    return this.find({ content : new RegExp(text, 'i') });
  };


  module.exports.Article = mongoose.model('Article', articleSchema);
})();