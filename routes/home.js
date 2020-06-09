const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Article = require('../models/Article');

// Home page logged in
router.get('/:username', async (req, res) => {
  try {
    const articles = await Article.find();
    const user = await User.findById(req.query.k);
    if (user.username === req.params.username && user.status === 'online') {
      res.render('home', { data: { user: user, articles: articles } });
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.error(err);
    res.redirect('/signup');
  }
});

// My articles page
router.get('/myarticles/:username', async (req, res) => {
  try {
    const user = await User.findById(req.query.k);
    if (user.status === 'online' && user.username === req.params.username) {
      const usersArticles = await Article.find({
        'author.username': user.username,
      });
      res.render('myarticles', {
        data: { user: user, articles: usersArticles },
      });
    }
  } catch (err) {
    console.error(err);
  }
});

// Create an article
router.post('/myarticles/:username', async (req, res) => {
  try {
    const user = await User.findById(req.query.k);
    if (user.username === req.params.username && user.status === 'online') {
      const newArticle = await new Article({
        title: req.body.title,
        text: req.body.text,
        author: user,
      });
      const saveArticle = newArticle.save();
      res.redirect(`/home/myarticles/${user.username}?k=${user._id}`);
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.error(err);
  }
});

// Delete Article From Home by Admin or user of their own article
router.post('/deletearticlehome', async (req, res) => {
  try {
    const user = await User.findById(req.query.k);
    const article = await Article.findById(req.body.articleId);
    if (
      user.rank === 'admin' ||
      user.rank === 'owner' ||
      JSON.stringify(article.author._id) === JSON.stringify(user._id)
    ) {
      if (user.status === 'online') {
        const deleteArticle = await Article.deleteOne({
          _id: req.body.articleId,
        });
        if (req.query.from === 'home') {
          res.redirect(`/home/${user.username}?k=${user._id}`);
        } else if (req.query.from === 'myarticles') {
          res.redirect(`/home/myarticles/${user.username}?k=${user._id}`);
        }
      } else {
        res.redirect('/login');
      }
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
