const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({
    message: 'Welcome to project O2'
  });
});

module.exports = router;
