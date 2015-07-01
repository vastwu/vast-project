var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;

var isWindows = process.platform === 'win32';

function fileExists(path) {
    if (isWindows && path.charAt(path.length - 1) === '/' &&
        path.charAt(path.length - 2) !== ':') {
        path = path.substring(0, path.length - 1);
    }
    try {
        fs.statSync(path);
        return true;
    } catch (e) {
        return false;
    }
}
function deleteFile (/*String*/fileName) {
    //summary: deletes a file or directory if it exists.
    var files, i, stat;
    if (fileExists(fileName)) {
        stat = fs.statSync(fileName);
        if (stat.isDirectory()) {
            files = fs.readdirSync(fileName);
            for (i = 0; i < files.length; i++) {
                deleteFile(path.join(fileName, files[i]));
            }
            fs.rmdirSync(fileName);
        } else {
            fs.unlinkSync(fileName);
        }
    }
}
function ozOtherFiles(){
    // 替换index.html
    var indexHtml = fs.readFileSync('index.html', {
        'encoding': 'utf-8'
    });

    var timeStamp = Date.now();
    var CSS_FILE_NAME = 'css';

    // 合并css文件, 改写index.html的引用
    var css = '';
    var isFirstMatch = true;
    indexHtml = indexHtml.replace(/\<link[^.]*href=['"]([\w\d-_\/]*\.css)['"][\w\d-_]*>/g, function(full, match, get){
        var path = 'output/tmp/' + match;
        console.log('find css file import :' + path);
        var findCss = fs.readFileSync(path, {
            'encoding': 'utf-8'
        });
        css += findCss;
        if(isFirstMatch){
            isFirstMatch = false;
            return '<link rel="stylesheet" href="' + CSS_FILE_NAME + '_' + timeStamp + '.css">';
        }else{
            return '';
        }
    });
    fs.writeFileSync('output/' + CSS_FILE_NAME + '_' + timeStamp + '.css', css);



    indexHtml = indexHtml.replace('src="lib/require.js" data-main="src\/main.js"', 'src="loader.js"');
    fs.writeFileSync('output/index.html', indexHtml);


    // 改写loader
    var loaderJs = fs.readFileSync('build/loader.js', {
        'encoding': 'utf-8'
    });
    loaderJs = loaderJs.replace('{TIME_STAMP}', timeStamp);
    fs.writeFileSync('output/loader.js', loaderJs);
    // 改写main.js
    var mainJs = fs.readFileSync('output/tmp/src/main.js', {
        'encoding': 'utf-8'
    });
    mainJs = 'window.$runTime = function(){' + mainJs + '};';
    fs.writeFileSync('output/main_' + timeStamp  + '.js', mainJs);

    // copy images
    fs.renameSync('output/tmp/images', 'output/images');
    deleteFile('output/tmp');
}

/**
 * start
 *
 */
console.log('build start');
deleteFile('output');
/**
 * 执行rjs压缩
 */
//node ./build/r.js -o ./build/buildConfig.js
var ls = spawn('node', ['./build/r.js', '-o', './build/buildConfig.js']);

ls.stdout.on('data', function (data) {
    console.log(data.toString());
});
ls.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
});
ls.on('close', function (code) {
    ozOtherFiles();
});


