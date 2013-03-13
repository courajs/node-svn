var exec = require('child_process').exec;

module.exports = function parse_svn_info(local_repo, next){
	var info_call = exec('svn info ' + local_repo,
		function(error, stdout, stderr){
			var out_lines;
			var extractor = /^(.*): (.*)$/;
			result = {};

			if (error) return next(error);

			out_lines = stdout.split('\n');
			out_lines.forEach(function(line){
				var match = extractor.exec(line);
				if( match ){
					result[match[1]] = match[2];
				}
			});
			next(null, result);
		});
	};
