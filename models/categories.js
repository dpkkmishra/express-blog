var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/expressblog');

var db = mongoose.connection;

// User Schema
var CategorySchema = mongoose.Schema({
	title: {
		type:  String,
		index: true
	}
});

var Category = module.exports = mongoose.model('categories', CategorySchema);

module.exports.getCategories = function(category, callback) {
	Category.find(category, callback);
}

module.exports.getCategoryById = function(id, callback) {	
	Category.findById(id, callback);
}

module.exports.createCategory = function(newCategory, callback) {	
	newCategory.save(callback);
}