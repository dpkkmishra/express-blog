var express = require('express');
var router = express.Router();

var Categories = require('../models/categories');
var Posts = require('../models/posts');

router.get('/show/:category', function(req, res, next) {
	Posts.getPostsByCategory(req.params.category, function(err, posts) {
		res.render('index', {
	        "title": req.params.category,
	        "posts": posts
	    })	
	});
})

router.get('/add', function(req, res, next) {
    res.render('addcategory', {
        "title": "Add Category"
    })
});

router.post('/add', function(req, res, next) {
	// get form values
	var title = req.body.title;		

	// Form Validation
	req.checkBody('title', 'Title field is required').notEmpty();	

	// Check Errors
	var errors = req.validationErrors();

	if(errors){
		res.render('addcategory', {
			'errors': errors,
			'title': title			
		})
	} else {
		// submit to DB
		var newCategory = new Categories({
            "title": title,            
		});

		// Create Post        
		Categories.createCategory(newCategory, function(err, post){			
            if (err) {
                res.send('There was an issue submitting the post');
            } else {                
				req.flash('success', 'Category Submitted');
				res.location('/');
				res.redirect('/');
            }
		});
	}
});

module.exports = router;
