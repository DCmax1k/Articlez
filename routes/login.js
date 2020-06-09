const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Login Page
router.get('/', (req, res) => {
  if (req.query.err) {
    res.render('login', {
      data: { error: req.query.err, info: { u: req.query.u } },
    });
  } else {
    res.render('login', { data: {} });
  }
});

// Login
router.post('/', async (req, res) => {
  try {
    const users = await User.find();
    for (i = 0; i < users.length; i++) {
      if (
        users[i].username === req.body.username &&
        users[i].password === req.body.password
      ) {
        const setOnline = await User.findByIdAndUpdate(
          users[i]._id,
          {
            $set: { status: 'online' },
          },
          { useFindAndModify: false }
        );
        const saveUser = await setOnline.save();
        res.redirect(`/home/${users[i].username}?k=${users[i]._id}`);
      }
    }
    if (!res.headersSent) {
      res.redirect(`/login?err=password&u=${req.body.username}`);
    }
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.redirect('/login');
    }
  }
});

module.exports = router;
