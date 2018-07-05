var express = require('express');
var router = express.Router();
var mongo = require('mongodb');

var Posts = require('../models/posts');

// Homepage Blog Posts
router.get('/', function(req, res, next) {
	Posts.getPosts({}, function(err, posts){
  		res.render('index', {
  			'posts' : posts
  		});
	})
});

module.exports = router;
