const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/', async (req, res) => {
  try {
    const user = await User.findById(req.query.k);
    const setOffline = await User.findByIdAndUpdate(
      req.query.k,
      {
        $set: { status: 'offline' },
      },
      { useFindAndModify: false }
    );
    const saveUser = setOffline.save();
    res.redirect('/login');
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
