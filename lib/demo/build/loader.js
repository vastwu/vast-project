(function(){
    var timeStamp = "{TIME_STAMP}";
    var VAR_VERSION = "runTimeVersion";
    var VAR_CODE = "runTimeCode";
    var isSupportLocalStorage = window.localStorage ? true : false;

    var loadMainJs = function(){
        var s = document.createElement('script');
        s.onload = function(){
            if(!isSupportLocalStorage){
                return;
            }
            window.localStorage[VAR_VERSION] = timeStamp;
            window.localStorage[VAR_CODE] = window.$runTime.toString();
            window.$runTime();
        };
        s.src = 'main_' + timeStamp + '.js';
        document.body.appendChild(s);
    }

    if(!isSupportLocalStorage){
        loadMainJs();
        return;
    }else{
        var version = window.localStorage[VAR_VERSION];
        if(!version || version < timeStamp){
            loadMainJs();
        }else{
            eval('(' + window.localStorage[VAR_CODE] + ')();');
        }
    }
})();
