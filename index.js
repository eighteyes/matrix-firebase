require('colors');

_ = require( 'lodash' );
async = require('async');
var D = require('debug');
debug = new D('firebase')

var fs = require('fs');
var e = {};

// add lib contents to export
// only do files that end in .js
  var files = require('fs').readdirSync(__dirname).filter(
    function(f){ return ( f.indexOf('.js') === f.length - 3 ) }
  );

  _.each(files, function (f) {
    e[f.slice(0, -3)] = require('./lib/' + f);
  })

  // do version check on debug
  if ( process.env.hasOwnProperty('DEBUG')){
    var msg;
    var info = JSON.parse(require('fs').readFileSync(__dirname + '/package.json'));
    var currentVersion = info.version;
    require('https').get(
      'https://raw.githubusercontent.com/matrix-io/matrix-firebase/master/package.json',
    function (res) {
      var write = "";
      res.on('data', function (c) {
        write += c;
      });
      res.on('end', function () {
        var remoteVersion = JSON.parse(write).version;
        if (currentVersion === remoteVersion) {
          msg = '(current)'.grey;
          e.current = true;
        } else {
          e.current = false;
          msg = '(can upgrade to '.yellow+ remoteVersion +')'.yellow
        }
        debug( '🔥  [ MATRIX ] Firebase v'.red + currentVersion.grey, msg )
      });
    })
  }

// shortcut for API sanity
e.init = e.util.init;

module.exports = e;
