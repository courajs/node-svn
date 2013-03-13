var path = require('path');
var spawn = require('child_process').spawn;

var SVN = module.exports = function SVN(local, remote){
	var that = this;

	this.local = path.resolve(local);
	this.remote = remote;

	if (!this.remote)
	this.get_remote(function(err, result){
		that.remote = result;
	})
}

SVN.prototype.get_remote = function get_remote(next){
	var parse_info = require('./parse_info.js');
	parse_info(this.local, function(err, result){
		if (err) return next(err);
		next(null, result['Repository Root']);
	})
}

SVN.prototype.update = function update(revision, next){
	
}