var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var photoSchema = new Schema({
	'name': String,
	'path': String,
	'message': String,
	'postedBy': {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	'views': Number,
	'likes': Number,
	'dislikes': Number,
	'createdAt': {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('photo', photoSchema);
