const express = require('express');
const router = express.Router();

const User = require('../models/User');

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

module.exports = router;
