const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Sign Up Page
router.get('/', (req, res) => {
  if (req.query.err) {
    res.render('signup', {
      data: {
        error: req.query.err,
        info: {
          f: req.query.f,
          l: req.query.l,
          u: req.query.u,
          e: req.query.e,
        },
      },
    });
  } else {
    res.render('signup', { data: {} });
  }
});

// Create account
router.post('/', async (req, res) => {
  try {
    const users = await User.find();
    let infoTaken = false;
    users.forEach((user, i) => {
      if (
        req.body.username === user.username &&
        req.body.email === user.email
      ) {
        if (!res.headersSent) {
          res.redirect(
            `/signup?err=usernameemail&f=${req.body.firstname}&l=${req.body.lastname}&u=${req.body.username}&e=${req.body.email}`
          );
        }
        infoTaken = true;
      } else if (req.body.username === user.username) {
        if (!res.headersSent) {
          res.redirect(
            `/signup?err=username&f=${req.body.firstname}&l=${req.body.lastname}&u=${req.body.username}&e=${req.body.email}`
          );
        }
        infoTaken = true;
      } else if (req.body.email === user.email) {
        if (!res.headersSent) {
          res.redirect(
            `/signup?err=email&f=${req.body.firstname}&l=${req.body.lastname}&u=${req.body.username}&e=${req.body.email}`
          );
        }
        infoTaken = true;
      }
    });
    if (!infoTaken) {
      const user = await new User({
        username: req.body.username,
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password,
      });
      const saveUser = await user.save();
      if (!res.headersSent) {
        res.redirect(`/home/${user.username}?k=${user._id}`);
      }
    }
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.redirect('/signup');
    }
  }
});

module.exports = router;
