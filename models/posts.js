var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/expressblog');

var db = mongoose.connection;

// User Schema
var PostSchema = mongoose.Schema({
	title: {
		type:  String,
		index: true
	},
	category: {
		type: String,		
		required:true
	},
	body: {
		type: String
	},
	image: {
		type: String
	},
	author: {
		type: String
	},
	date: {
		type: Date
	},
	comments: {
		type: [{}]
	}
});

var Post = module.exports = mongoose.model('posts', PostSchema);

module.exports.getPosts = function(query, callback) {	
	var limit = 10;
	var skip = 0;
	if(query.limit)
		limit = query.limit;

	if(query.skip)
		skip = query.skip;
		
	Post.find({}, callback).skip(skip).limit(limit);
}

module.exports.getPostById = function(id, callback) {	
	Post.findById(id, callback);
}

module.exports.getPostByTitle = function(title, callback) {
	var query = {title: title};
	Post.findOne(query, callback);
}

module.exports.createPost = function(newPost, callback) {
	newPost.save(callback);
}

module.exports.getPostsByCategory = function(category, callback) {
	var query = {category: category};
	Post.find(query, callback);
}

module.exports.updateComment = function(post_id, newComment, callback) {
	Post.findOneAndUpdate(
	    { _id: post_id }, 
	    { $push: { comments: newComment } },
	    callback
	);

}

