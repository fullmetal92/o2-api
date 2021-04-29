const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json('{"name":"John", "age":31, "city":"New York"}', );
});

module.exports = router;
