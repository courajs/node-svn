var exec = require('child_process').exec;
var parseString = require('xml2js').parseString;



module.exports = function(options, next){
	var command = ['svn', 'log', '--xml'];
	options = options || {};
	command = command.concat(limit(options));
	command = command.concat(revision(options));
	command = command.join(' ');
	console.log('Command! "'+command+'"');

	exec(command, {cwd: this.local}, function(error, stdout, stderr){
		if(error) return next(error);
		parseString(stdout, function(error, result){
            if(error) return next(error);
            result = convert_from_weird_xml_object_to_awesome_json(result);
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


function convert_from_weird_xml_object_to_awesome_json(old){
    var logs = old.log.logentry.map(convert_single_log_entry);
    return logs;

    function convert_single_log_entry(old){
        var pojo = {};
        pojo.revision = parseInt(old.$.revision);
        pojo.author = old.author[0];
        pojo.date = new Date(old.date[0]);
        pojo.message = old.msg[0];
        return pojo;
    }

}