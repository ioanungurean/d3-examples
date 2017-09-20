var express = require('express');
var router = express.Router();

// get homepage
router.get('/', ensureAuthenticated, function (req, res) {
  res.send('index page');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error_msg','You are not logged in');
    res.redirect('/users/login');
  }
}

module.exports = router;
