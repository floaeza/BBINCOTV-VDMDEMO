
function Red(){
    //alert(PressedKey);
    location.reload(true);
}

function Blue(){
    // var Up = 0;
    // Up = ASTB.Upgrade('http://10.0.3.10/bbinco_28_x4x_611.mcfs');
    // alert(Up);
}

function Green(){
    //player.play({
    //    uri: 'http://10.0.3.205:8080//media/USB-E0D55EA574F1F4718944A9E1-1/378_Diseñando tu Amor_undefined.mp4',
    //    solution: 'auto'
    //});
}

function Yellow(){
    //if(typeof(ASTB) !== 'undefined') {
    //    Browser.Action(16);
    //}
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
    }
}

function Menu(){
    if(CurrentModule !== 'Menu' && Device['Services']['ActiveMenu'] === true){
        GoPage('menu.php', Device['MenuId'], 'Menu');
    } else if(CurrentModule === 'Tv' && Device['Services']['ActiveMenu'] === false){
        TvRecorder();
    }
}
