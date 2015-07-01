({
    appDir: "../",
    baseUrl:"./src",
    name:"main",
    dir:"../output/tmp/",
    optimize:"uglify",
    //optimize:"none",
    optimizeCss: "standard",
    wrap:false,
    keepBuildDir: false,
    fileExclusionRegExp:'build|lib',
    onBuildWrite:(function(){
        var rdefineEnd = /\}\);?$/;
        var requireReg = /var\s?([\w\d-_]*)\s?=\s?require\(['"]([^\)]*)['"]\);?/g;
        var debugReg = /\/\*\s?debug_start\s?\*\/[^]*?\s?debug_end\s\*\//g;

        return function(name, path, contents){

            var paths = name.split('/');
            var var_name = paths.pop();
            var_name = var_name.split('.')[0];

            contents = contents.trim();
            //define(factory)  =>  var xx = (function());
            contents = contents.replace( /define\([^{]*{/, "var " + var_name + " = (function(){" )
                        .replace( rdefineEnd, "})();" );
            //remove require
            //contents = contents.replace(requireReg, '');
            contents = contents.replace(requireReg, function(match, val, path){
                var paths = path.split('\/');
                var fileName = paths.pop().replace('.js', '');
                if(val === fileName){
                    return '';
                }else{
                    return "var " + val + "=" + fileName;
                }
            });
            contents = contents.replace(debugReg, '');
            return contents;
        }
    })()
})
