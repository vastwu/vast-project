var file = require('./file');
var path = require('path');


var RUN_PATH = path.join(__dirname, '../');

var runPath = function(path){
    return RUN_PATH + path;
}

var main = {
    create: function () {
        console.log('create start...', RUN_PATH);

        file.deleteFile(runPath('htdocs'));
        var result = file.copyDir(runPath('lib/demo'), runPath('htdocs'));

        file.copyFile(runPath('node_modules/requirejs/require.js'), runPath('htdocs/lib/require.js'));
        file.copyFile(runPath('node_modules/requirejs/bin/r.js'), runPath('htdocs/build/r.js'));

        console.log('success!');
    }
}

module.exports = main;
