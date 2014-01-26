var exec = require('child_process').exec;
var parseString = require('xml2js').parseString;
var Revision = require('./Revision.js');



module.exports = function(options, next){
	var command = ['svn', 'log', '--xml'];
	options = options || {};
	command = command.concat(limit(options));
	command = command.concat(revision(options));
	if (options.remote) {
		command = command.concat([options.remote]);
	} else if (this.remote) {
		command = command.concat([this.remote]);
	}
	command = command.join(' ');

	exec(command, {cwd: this.local}, function(error, stdout, stderr){
		if(error) return next(error);
		parseString(stdout, function(error, result){
            if(error) return next(error);
            result = result.log.logentry.map(Revision.from_xml);
            next(error, result);
		})
	})
}

function limit(options){
	if(options.limit) return ['-l', options.limit.toString()];
	return [];
}

function revision(options){
	if(options.revision) return ['-r', options.revision.toString()];
	if(options.start){
		var rev = [];
        rev.push(options.start.toString());
		rev.push(':');
		rev.push(options.end ? options.end.toString() : 'HEAD');
        return ['-r', rev.join('')];
	}
	return [];
}