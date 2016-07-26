var spawn = require('child_process').spawn;

module.exports = function(local, revision, next){
  var args = ['update', '-r', revision];
  var child = spawn('svn', args, {cwd: local});
  var stdout = '';
  var stderr = '';

  child.stdout.on('data', function (data) {
    stdout += data;
  });

  child.stderr.on('data', function (data) {
    console.log('svn error output: ' + data);
    stderr += data;
  });

  child.on('close', function (code) {
    if (code !== 0) {
      stderr += 'svn update exited with code ' + code;
      console.log('svn update exited with code ' + code);
      next(new Error(stderr));
    } else {
      next(undefined, stdout);
    }
  });

};

