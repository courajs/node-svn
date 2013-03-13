var SVN = require('./index.js');

// var svn = new SVN('/Users/aaron/dev/');
// svn.get_remote();

var parse_info = require('./parse_info.js');
parse_info('/Users/aaron/dev/web', function(err, result){console.error(err);console.log(result);});