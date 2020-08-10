const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Article = require('../models/Article');

// Delete Account
router.post('/deleteaccount/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const articles = await Article.deleteMany({ 'author._id': user._id });
    if (user.status === 'online') {
      const deleteUser = await User.deleteOne({ _id: user._id });
      res.redirect('/');
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.error(err);
  }
});

// Change Name
router.post('/changename/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const articles = await Article.updateMany(
      { 'author._id': user._id },
      {
        'author.firstname': req.body.newFirstname,
        'author.lastname': req.body.newLastname,
      },
      { userFindAndModify: false }
    );
    if (user.status === 'online') {
      const changeName = await User.findByIdAndUpdate(
        user._id,
        {
          firstname: req.body.newFirstname,
          lastname: req.body.newLastname,
        },
        { useFindAndModify: false }
      );
      const saveName = await changeName.save();
      res.json({
        updatedFirst: req.body.newFirstname,
        updatedLast: req.body.newLastname,
      });
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.error(err);
  }
});

// Change Email
router.post('/changeemail/:id/', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user.status === 'online') {
      const changeEmail = await User.findByIdAndUpdate(
        user._id,
        {
          email: req.body.newEmail,
        },
        { useFindAndModify: false }
      );
      const saveUser = await changeEmail.save();
      res.json({
        updatedEmail: req.body.newEmail,
      });
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.error(err);
  }
});

// Change password
router.post('/changepassword/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user.status === 'online') {
      if (req.body.currentPassword === user.password) {
        const changeThePassword = await User.findByIdAndUpdate(
          user._id,
          {
            password: req.body.newPassword,
          },
          { useFindAndModify: false }
        );
        const savePassword = await changeThePassword.save();
        res.json({
          passwordChanged: true,
        });
      } else {
        res.json({
          passwordChanged: false,
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
