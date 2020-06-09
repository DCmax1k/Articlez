const mongoose = require('mongoose');

const ArticleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: Object,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  extraData: Object,
});

module.exports = mongoose.model('Article', ArticleSchema);
