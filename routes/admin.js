const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Article = require('../models/Article');

// Admin Page
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findById(req.query.k);
    const allUsers = await User.find();
    if (user.username === req.params.username && user.status === 'online') {
      if (user.rank === 'admin' || user.rank === 'owner') {
        res.render('admin', { data: { user: user, allUsers: allUsers } });
      } else {
        res.redirect('/login');
      }
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.erroro(err);
  }
});

// Promote User
router.post('/promote/:adminid', async (req, res) => {
  try {
    const admin = await User.findById(req.params.adminid);
    if (admin.rank === 'owner' || admin.rank === 'admin') {
      const user = await User.findById(req.query.k);
      const updateUser = await User.findByIdAndUpdate(
        user._id,
        {
          $set: { rank: 'admin' },
        },
        { useFindAndModify: false }
      );
      const saveUser = await updateUser.save();
      res.redirect(`/admin/${admin.username}?k=${admin._id}`);
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.error(err);
  }
});

// Demote User
router.post('/demote/:adminid', async (req, res) => {
  try {
    const admin = await User.findById(req.params.adminid);
    if (admin.rank === 'owner' || admin.rank === 'admin') {
      const user = await User.findById(req.query.k);
      const updateUser = await User.findByIdAndUpdate(
        user._id,
        {
          $set: { rank: 'user' },
        },
        { useFindAndModify: false }
      );
      const saveUser = await updateUser.save();
      res.redirect(`/admin/${admin.username}?k=${admin._id}`);
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.error(err);
  }
});

// Delete User
router.post('/deleteaccount/:adminid', async (req, res) => {
  try {
    const admin = await User.findById(req.params.adminid);
    const user = await User.findById(req.query.k);
    if (admin.rank === 'owner' || admin.rank === 'admin') {
      const articles = await Article.deleteMany({
        'author.username': user.username,
      });
      const deleteUser = await User.deleteOne({ _id: req.query.k });
      res.json({ response: 'success' });
    } else {
      res.json({
        response: 'notAdmin',
      });
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
