// @ts-nocheck

function Red(){
    var relo = window.location.href;
    window.location.href = relo;
}

function Blue(){
    if (window.tizen !== undefined){
        var onSuccess = function() {
            Debug("[rebootDevice] succeeded!");
        };
        var onError = function(error) {
            Debug("[rebootDevice] failed! error code: " + error.code + " error name: " + error.name + "  message " + error.message);
        };
        b2bcontrol.rebootDevice(onSuccess, onError);
    }else if(typeof(ASTB) !== 'undefined'){
        ASTB.Reboot();
    }

    
}
function Green(){

    //alert(window.location);
    // //alert(JSON.stringify(Browser.GetStats()));
    // var sBrowser, sUsrAg = navigator.userAgent;

    // if(sUsrAg.indexOf("Chrome") > -1) {
    //     sBrowser = "Google Chrome \n\n --- " + navigator.appName + "\n\n --- "+ navigator.appVersion + " \n\n---" +navigator.userAgent;
    // } else if (sUsrAg.indexOf("Safari") > -1) {
    //     sBrowser = "Apple Safari  \n\n --- " + navigator.appName + "\n\n --- "+ navigator.appVersion + " \n\n---" +navigator.userAgent;
    // } else if (sUsrAg.indexOf("Opera") > -1) {
    //     sBrowser = "Opera \n\n --- " + navigator.appName + "\n\n --- "+ navigator.appVersion + " \n\n---" +navigator.userAgent;
    // } else if (sUsrAg.indexOf("Firefox") > -1) {
    //     sBrowser = "Mozilla Firefox \n\n --- " + navigator.appName + "\n\n --- "+ navigator.appVersion + " \n\n---" +navigator.userAgent;
    // } else if (sUsrAg.indexOf("MSIE") > -1) {
    //     sBrowser = "Microsoft Internet Explorer \n\n --- " + navigator.appName + "\n\n --- "+ navigator.appVersion + " \n\n---" +navigator.userAgent;
    // }

    // alert("Usted está utilizando: " + sBrowser);
    
}

function Yellow(){
    // @ts-nocheck
    //var f = gSTB.GetEnv('{ "varList":["timezone_conf"] }');
    //Debug(f);
    //var g = gSTB.SetEnv('{ "timezone_conf":"America/Mexico_City" }');
    //Debug(g);

    //player.speed = 4;
    //Debug(player.speeds);
}

function Close(){
    if(CurrentModule === 'Tv'){
        TvClose();
    } else if(CurrentModule === 'Menu'){
        //
    } else if(CurrentModule === 'Movies'){
        VodClose();
    } else if(CurrentModule === 'Moods'){
        MoodsClose();
    }
}

function Back(){
    if(CurrentModule === 'Tv'){
        TvClose();
    } else if(CurrentModule === 'Menu'){
        //
    } else if(CurrentModule === 'Movies'){
        VodClose();
    } else if(CurrentModule === 'Moods'){
        MoodsClose();
    }else{
        GoPage('menu.php', Device['MenuId'], 'Menu');
    }
}

function Menu(){
    Debug('--------------------------MENU() CurrentModule:: ' +CurrentModule + ' DEVICE[SERVICES][ACTIVEMENU] '+ Device['Services']['ActiveMenu']);
    if(CurrentModule !== 'Menu' && Device['Services']['ActiveMenu'] === true){
        //alert("Menu");
        Debug('----------- GOPAGE');
        //if(CurrentModule == 'Tv'){
           //document.getElementById('loadingTV').style.display = "block"; 
        //}
        
        //GoPage('menu.php', Device['MenuId'], 'Menu');
        GoPage('menu.php', Device['MenuId'], 'Menu');
        
    } else if(CurrentModule === 'Tv' && Device['Services']['ActiveMenu'] === false){
        Debug('----------- TV RECORDER');
        TvRecorder();
    }
}
