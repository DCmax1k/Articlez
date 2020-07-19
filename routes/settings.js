const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Article = require('../models/Article');

// Delete Account
router.post('/deleteaccount/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const articles = await Article.remove(
      { 'author._id': user._id },
      { useFindAndModify: false }
    );
    if (user.status === 'online') {
      const deleteUser = await User.findByIdAndRemove(user._id, {
        userFindAndModify: false,
      });
      res.redirect('/');
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.error(err);
  }
});

// Change Name
router.post('/changename/:id/:location', async (req, res) => {
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
      if (req.params.location === 'home') {
        res.redirect(`/home/${user.username}?k=${user._id}`);
      } else if (req.params.location === 'myarticles') {
        res.redirect(`/home/myarticles/${user.username}?k=${user._id}`);
      }
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.error(err);
  }
});

// Change Email
router.post('/changeemail/:id/:location', async (req, res) => {
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
      if (req.params.location === 'home') {
        res.redirect(`/home/${user.username}?k=${user._id}`);
      } else if (req.params.location === 'myarticles') {
        res.redirect(`/home/myarticles/${user.username}?k=${user._id}`);
      }
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.error(err);
  }
});

// Change password
router.post('/changepassword/:id/:location', async (req, res) => {
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
        if (req.params.location === 'home') {
          res.redirect(`/home/${user.username}?k=${user._id}`);
        } else if (req.params.location === 'myarticles') {
          res.redirect(`/home/myarticles/${user.username}?k=${user._id}`);
        }
      } else {
        if (req.params.location === 'home') {
          res.redirect(`/home/${user.username}?k=${user._id}&cp=err`);
        } else if (req.params.location === 'myarticles') {
          res.redirect(
            `/home/myarticles/${user.username}?k=${user._id}&cp=err`
          );
        }
      }
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
