var exec = require('child_process').exec;
var parseString = require('xml2js').parseString;



module.exports = function(options, next){
	var command = ['svn', 'log', '--xml'];
	options = options || {};
	if (options.limit){
		command.push('-l');
		command.push(options.limit);
	}
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