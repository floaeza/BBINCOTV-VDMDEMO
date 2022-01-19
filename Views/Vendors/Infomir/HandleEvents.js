// @ts-nocheck
var Indexps     = 0,
    NewSchedule = [],
    ProgramId   = '',
    Title       = '',
    Fecha       = '',
    Source      = '',
    Start       = '',
    End         = '',
    archivo     = '',
    x24Today,
    x24Hour;
window.stbEvent = {
    onEvent: function ( event, info ) {
        Debug('Evento:  '+event);
        EventNetman = gSTB.GetLanLinkStatus();

        switch ( Number (event) ) {

            case 1:
                //The player reached the end of the media content or detected a discontinuity of the stream
                EventString = 'STATUS_END_OF_STREAM';
                
                if(Executing === false){
                    UpdateQuickInfoDevice();
                }
                if(PlayingRecording == true){
                    OpenRecordPlayOptions();
                }else if(PlayingChannel == true){
                    if(gSTB.GetDeviceMacAddress() === '00:1a:79:74:b7:d4' || gSTB.GetDeviceMacAddress() === '00:1a:79:74:b7:5b'){
                        x24Today = new Date();	
                        x24Hour = x24Today.getHours() + ':' + x24Today.getMinutes() + ':' + x24Today.getSeconds();
                        setInfomirLog('MULTICAST,'+gSTB.GetDeviceMacAddress()+','+gSTB.RDir('IPAddress')+','+x24Today.getDate() + "/" + (x24Today.getMonth() +1) + "/" + x24Today.getFullYear()+' '+x24Hour+',STATUS_END_OF_STREAM '+URLLog);
                    }
                    setTimeout(PlayChannel2(URLLog),3000);
                }
            break;

            case 2:
                //Information on audio and video tracks of the media content is received
                EventString = 'INFORMATION_RECEIVED';
                if(gSTB.GetDeviceMacAddress() === '00:1a:79:74:b7:d4' || gSTB.GetDeviceMacAddress() === '00:1a:79:74:b7:5b'){
                    var x24Today = new Date();	
                    var x24Hour = x24Today.getHours() + ':' + x24Today.getMinutes() + ':' + x24Today.getSeconds();
                    setInfomirLog('MULTICAST,'+gSTB.GetDeviceMacAddress()+','+gSTB.RDir('IPAddress')+','+x24Today.getDate() + "/" + (x24Today.getMonth() +1) + "/" + x24Today.getFullYear()+' '+x24Hour+',INFORMATION_RECEIVED '+URLLog);
                }
                Debug("---------------> " + EventString + " <---------------");
            break;

            case 4:
                //Video and/or audio playback has begun
                EventString = 'STATUS_PLAYING';
                if(gSTB.GetDeviceMacAddress() === '00:1a:79:74:b7:d4' || gSTB.GetDeviceMacAddress() === '00:1a:79:74:b7:5b'){
                    var x24Today = new Date();	
                    var x24Hour = x24Today.getHours() + ':' + x24Today.getMinutes() + ':' + x24Today.getSeconds();
                    setInfomirLog('MULTICAST,'+gSTB.GetDeviceMacAddress()+','+gSTB.RDir('IPAddress')+','+x24Today.getDate() + "/" + (x24Today.getMonth() +1) + "/" + x24Today.getFullYear()+' '+x24Hour+',STATUS_PLAYING '+URLLog);
                }
                if(Executing === false){
                    UpdateQuickInfoDevice();
                }
            break;

            case 5:
                //Error when opening the content: content not found on the server or connection with the server was rejected
                EventString = 'STATUS_ERROR_STREAM';
                
                Debug(EventString);
                if(Executing === false){
                    UpdateQuickInfoDevice();
                }
                if(PlayingChannel == true){
                    if(gSTB.GetDeviceMacAddress() === '00:1a:79:74:b7:d4' || gSTB.GetDeviceMacAddress() === '00:1a:79:74:b7:5b'){
                        x24Today = new Date();	
                        x24Hour = x24Today.getHours() + ':' + x24Today.getMinutes() + ':' + x24Today.getSeconds();
                        setInfomirLog('MULTICAST,'+gSTB.GetDeviceMacAddress()+','+gSTB.RDir('IPAddress')+','+x24Today.getDate() + "/" + (x24Today.getMonth() +1) + "/" + x24Today.getFullYear()+' '+x24Hour+',STATUS_ERROR_STREAM '+URLLog);
                    }
                    setTimeout(PlayChannel2(URLLog),3000);
                }
            break;

            case 32:
                //HDMI device has been connected.
                EventHdmi = 1;
            
                Debug('....................HDMI 1........................');
                gSTB.StandBy(false);
                Debug('..................STANDBY EXIT..........................');
                var SWS = gSTB.GetStandByStatus();
                Debug('----------------------- SWS'+SWS);
                if(Executing === false){
                    UpdateQuickInfoDevice();
                }
                
                break;  

            case 33:
                //HDMI device has been disconnected.
                EventHdmi = -1;

                if(Executing === false){
                    UpdateQuickInfoDevice();
                }
                break;
            case 36:
                info = JSON.parse(info);
                Debug('TimeShift mode is enabled. TimeShift data:', info);
                break;
            case 39: //Task started recording.
                    var x24Today = new Date();	
                    var x24Hour = x24Today.getHours() + ':' + x24Today.getMinutes() + ':' + x24Today.getSeconds();
                    EventString = 'STATUS_START_RECORD';
                    Debug("---------------> " + EventString + " <---------------");
                    var info2 = JSON.parse(info);
                    var inre = JSON.parse(pvrManager.GetTaskByID(info2.id));
                    var file = inre.fileName;
                    //ShowRecorderMessage(file);
                    if(isNaN(file.charAt(file.length - 1))){
                       UpdateProgramOpera(file, inre.id, '3', 'true'); 
                    }else{
                        file = file.substring(0, file.length - 1);
                        UpdateProgramOpera(file, inre.id, '3', 'true'); 
                    }
                    
                    UpdateDiskInfoInformir();
                    setInfomirLog('RECORDER,'+gSTB.GetDeviceMacAddress()+','+gSTB.RDir('IPAddress')+','+x24Today.getDate() + "/" + (x24Today.getMonth() +1) + "/" + x24Today.getFullYear()+' '+x24Hour+',STATUS_START_RECORD '+inre.fileName);

                    break;
            case 34: //Task has been finished successfully.
                    var x24Today = new Date();	
                    var x24Hour = x24Today.getHours() + ':' + x24Today.getMinutes() + ':' + x24Today.getSeconds();
                    EventString = 'STATUS_END_RECORD';
                    Debug("---------------> " + EventString + " <---------------");
                    var info2 = JSON.parse(info);
                    var inre = JSON.parse(pvrManager.GetTaskByID(info2.id));
                    //UpdateProgramOpera(inre.fileName, '4', 'false');
                    var file = inre.fileName;
                    if(isNaN(file.charAt(file.length - 1))){
                       UpdateProgramOpera(file, inre.id, '4', 'false'); 
                    }else{
                        file = file.substring(0, file.length - 1);
                        UpdateProgramOpera(file, inre.id, '4', 'false'); 
                    }
                    UpdateDiskInfoInformir();
                    setInfomirLog('RECORDER,'+gSTB.GetDeviceMacAddress()+','+gSTB.RDir('IPAddress')+','+x24Today.getDate() + "/" + (x24Today.getMonth() +1) + "/" + x24Today.getFullYear()+' '+x24Hour+',STATUS_END_RECORD '+inre.fileName);
                    break;
            case 35: //Task has been finished with error.
                    var x24Today = new Date();	
                    var x24Hour = x24Today.getHours() + ':' + x24Today.getMinutes() + ':' + x24Today.getSeconds();
                    EventString = 'STATUS_ERROR_RECORD';
                    Debug("---------------> " + EventString + " <---------------");
                    var info2 = JSON.parse(info);
                    var inre = JSON.parse(pvrManager.GetTaskByID(info2.id));
                    Debug(inre.errorCode);
                    //UpdateProgramOpera(inre.fileName, '2', 'false');
                    UpdateDiskInfoInformir();
                    setInfomirLog('RECORDER,'+gSTB.GetDeviceMacAddress()+','+gSTB.RDir('IPAddress')+','+x24Today.getDate() + "/" + (x24Today.getMonth() +1) + "/" + x24Today.getFullYear()+' '+x24Hour+',STATUS_ERROR_RECORD '+inre.errorCode);
                    if(inre.errorCode == -10){
                        restartTask(inre.fileName, inre.ulr, inre.endTime, inre.errorCode);
                    }else{
                        ShowRecorderMessage('An error occurred with the recording, contact the administrator. \n\nError code: ' + errorCode);
                    }
                    break;
        }
    },
    onBroadcastMessage: function( from, message, data ) {
        if ( message === 'storage.mount' ) {
            InfomirUSB = 1;
        } else if ( message === 'storage.unmount' ) {
            InfomirUSB = 0;
        }
    }
};



/*******************************************************************************
 * Actualiza informacion del disco duro
 *******************************************************************************/

function UpdateDiskInfoInformir(){
    Debug("-------> UPDATE DISK INFOMIR");
    storageInfo = JSON.parse(gSTB.GetStorageInfo('{}'));
    USB = storageInfo.result || [];
    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'SetPvrInfo',
            LocationId : Device['LocationId'],
            MacAddress : gSTB.GetDeviceMacAddress(),
            TotalSize : USB[0].size / 1024,
            AvailableSize : USB[0].freeSize / 1024, 
            SizeRecords : '320'
        },
        success: function (response){
            //Debug(response);
        }
    });
    ;
}

function restartTask(name, url, endTime, errorCode){
    var Start =Math.ceil((Date.now()/1000)+5);
    endTime = Math.ceil(endTime);
    Start = Start.toString();
    endTime = endTime.toString();
    if(isNaN(name.charAt(name.length - 1))){
        if(pvrManager.CreateTask(url, name+"1", Start, endTime)>-1){   
            //ShowRecorderMessage('La grabacion se actualizó ' + Start + ' ' + endTime);
        }else{
            ShowRecorderMessage('An error occurred with the recording, contact the administrator. \n\nError code: ' + errorCode);
        }
    }else{
        var num = parseInt(name.charAt(name.length - 1));
        num += 1;
        name = name.substring(0, name.length-1) + num;
        if(pvrManager.CreateTask(url, name+num, Start, endTime)>-1){
            //ShowRecorderMessage('La grabacion se actualizó ' + num + ' veces');
        }else{
            ShowRecorderMessage('An error occurred with the recording, contact the administrator. \n\nError code: ' +errorCode);
        }
        num = null;
    }
}

/*******************************************************************************
 * Obtien lista de programas para grabar
 *******************************************************************************/

function GetProgramsToScheduleInformir(){
    Debug('-------->> GetProgramsToSchedule');
    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'CheckProgramsToSchedule',
            MacAddress : MacAddress
        },
        success: function (response){
            ProgramsToSchedule = $.parseJSON(response);

            Indexps     = 0;
            NewSchedule = [];
            ProgramId   = '';
            Title       = '';
            Fecha       = '';
            Source      = '';
            Start       = '';
            End         = '';

            for(Indexps = 0;  Indexps < ProgramsToSchedule.length; Indexps++){

                ProgramId = ProgramsToSchedule[Indexps]['id_programa'];
                Title = ProgramsToSchedule[Indexps]['titulo_programa'];
                Fecha = ProgramsToSchedule[Indexps]['fecha_programa'];
                Source = ProgramsToSchedule[Indexps]['url_canal'];
                Start = parseFloat(ProgramsToSchedule[Indexps]['utc_inicio']);
                End = parseFloat(ProgramsToSchedule[Indexps]['utc_final']);
                Start =Math.ceil(Start);
                End = Math.ceil(End);

                Start = Start.toString();
                End = End.toString();
                Debug('>> '+Source +', '+ Title +', '+ Start +', '+ End);

                Debug('ProgramsToSchedule.length: '+ProgramsToSchedule.length);
                
                storageInfo = JSON.parse(gSTB.GetStorageInfo('{}'));
                USB = storageInfo.result || [];
                Debug(USB[0].mountPath+'/'+Title);
                Source = Source.replace('igmp','udp');
                Source = (Source).slice(0, 6) + "@" + (Source).slice(6);

                var tas = JSON.parse(pvrManager.GetAllTasks());
                var reco = [];
                for(var x = 0; x < tas.length; x++){
                    if (tas[x].state === 3){
                        reco.push(tas[x]);
                    }
                }

                var NewTask = pvrManager.CreateTask(Source, USB[0].mountPath+"/"+ProgramId+'_'+Title.replace(/ /g, "_")+'_'+Fecha+".ts", Start, End)
                if (NewTask<0){
                    //CurrentTime = Date.UTC(moment().format('Y'), moment().format('MM'), moment().format('DD'), moment().format('HH'), moment().format('mm'));
                    Debug('> Fail new schedule');
                    DeleteProgramInformir(ProgramId);
                } else {
                    var tasks = JSON.parse(pvrManager.GetAllTasks());
                    Debug(tasks[tasks.length-1].id);
                    Debug('New schedule added, streamid = '+tasks[tasks.length-1].id);
                    Debug('> '+ProgramId + ', '+OperationsList.record+', '+tasks[tasks.length-1].id);
                    UpdateProgramStreamIdInformir(ProgramId, '3', tasks[tasks.length-1].id);
                    UpdateProgramStatusInformir(ProgramId, '3', tasks[tasks.length-1].fileName);
                }
            }
        }
    });
    //Debug('--------<< GetProgramsToSchedule');
}

function GetProgramsToScheduleAfterRebootInformir(){
    Debug('-------->> GetProgramsToSchedule');
    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'CheckProgramsToScheduleAfterReboot',
            MacAddress : MacAddress
        },
        success: function (response){
            ProgramsToSchedule = $.parseJSON(response);

            Indexps     = 0;
            NewSchedule = [];
            ProgramId   = '';
            Title       = '';
            Fecha       = '';
            Source      = '';
            Start       = '';
            End         = '';

            for(Indexps = 0;  Indexps < ProgramsToSchedule.length; Indexps++){

                ProgramId = ProgramsToSchedule[Indexps]['id_programa'];
                Title = ProgramsToSchedule[Indexps]['titulo_programa'];
                Fecha = ProgramsToSchedule[Indexps]['fecha_programa'];
                Source = ProgramsToSchedule[Indexps]['url_canal'];
                Start = parseFloat(ProgramsToSchedule[Indexps]['utc_inicio']);
                End = parseFloat(ProgramsToSchedule[Indexps]['utc_final']);
                Start =Math.ceil(Start);
                End = Math.ceil(End);

                Start = Start.toString();
                End = End.toString();
                Debug('>> '+Source +', '+ Title +', '+ Start +', '+ End);

                Debug('ProgramsToSchedule.length: '+ProgramsToSchedule.length);
                
                storageInfo = JSON.parse(gSTB.GetStorageInfo('{}'));
                USB = storageInfo.result || [];
                Debug(USB[0].mountPath+'/'+Title);
                Source = Source.replace('igmp','udp');
                Source = (Source).slice(0, 6) + "@" + (Source).slice(6);

                var tas = JSON.parse(pvrManager.GetAllTasks());
                var reco = [];
                for(var x = 0; x < tas.length; x++){
                    if (tas[x].state === 3){
                        reco.push(tas[x]);
                    }
                }

                var NewTask = pvrManager.CreateTask(Source, USB[0].mountPath+"/"+ProgramId+'_'+Title.replace(/ /g, "_")+'_'+Fecha+".ts", Start, End)
                if (NewTask<0){
                    //CurrentTime = Date.UTC(moment().format('Y'), moment().format('MM'), moment().format('DD'), moment().format('HH'), moment().format('mm'));
                    Debug('> Fail new schedule');
                    ShowRecorderMessage('An error occurred while recording '+ Title+', try again. If the problem persists contact the administrator.');
                    
                    DeleteProgramInformir(ProgramId);
                } else {
                    var tasks = JSON.parse(pvrManager.GetAllTasks());
                    Debug(tasks[tasks.length-1].id);
                    Debug('New schedule added, streamid = '+tasks[tasks.length-1].id);
                    Debug('> '+ProgramId + ', '+OperationsList.record+', '+tasks[tasks.length-1].id);
                    UpdateProgramStreamIdInformir(ProgramId, '3', tasks[tasks.length-1].id);
                    UpdateProgramStatusInformir(ProgramId, '3', tasks[tasks.length-1].fileName);
                }
            }
        }
    });
    //Debug('--------<< GetProgramsToSchedule');
}

/*******************************************************************************
 * Obtien lista de programas a eliminar
 *******************************************************************************/

 function GetSchedulesToDeleteInformir(){
    
    //Debug('-------->> GetSchedulesToDelete');
    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'CheckSchedulesToDelete',
            MacAddress : MacAddress
        },
        success: function (response){
            ProgramsToDelete = $.parseJSON(response);

            var Indexps     = 0;


            var ResultDelete = -1,
                StreamId     = -1,
                AssetId      = -1,
                Active       = -1;

            for(Indexps = 0;  Indexps < ProgramsToDelete.length; Indexps++){

                StreamId = parseInt(ProgramsToDelete[Indexps].id_stream,10);
                AssetId  = parseInt(ProgramsToDelete[Indexps].id_asset,10);
                Active   = parseInt(ProgramsToDelete[Indexps].grabacion_activa,10);
                Operation = parseInt(ProgramsToDelete[Indexps].id_operacion,10);
                
                if(Active === 0 && Operation === 4){
                    ResultDelete = gSTB.RDir('RemoveFile "'+ProgramsToDelete[Indexps].file);
                    ResultDelete = gSTB.RDir('RemoveFile "'+ProgramsToDelete[Indexps].file+'.ts"');
                    UpdateDiskInfoInformir();
                    DeleteProgramInformir(ProgramsToDelete[Indexps].id_programa);
                } else {
                    pvrManager.RemoveTask(StreamId,3);
                    UpdateDiskInfoInformir();
                    DeleteProgramInformir(ProgramsToDelete[Indexps].id_programa); 
                }
            }
        }
    });
    
    //Debug('--------<< GetSchedulesToDelete');
}

/*******************************************************************************
 * Actualiza el estatus de la grabacion y su stream id
 *******************************************************************************/

function DeleteProgramInformir(ProgramId){
    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'DeleteProgram',
            ProgramId : ProgramId
        },
        success: function (response){
            //Debug(response);
        }
    });
}
function DeleteProgramByFile(file){
    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'DeleteProgramByFile',
            File : file
        },
        success: function (response){
            //Debug(response);
        }
    });
}
/*******************************************************************************
 * Actualiza el estatus de la grabacion mediante el Stream Id y el Asset Id
 *******************************************************************************/

 function UpdateProgramOpera(file, id, OperationId, act){

    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'UpdateProgramOpera',
            File : file,
            Id: id,
            OperationId : OperationId,
            ActiveRecording: act
        },
        success: function (response){
            //Debug('----------UpdateProgramOpera----------');
            Debug(response);
        }
    });
}
/*******************************************************************************
 * Actualiza el estatus de la grabacion y su stream id
 *******************************************************************************/

function UpdateProgramStatusInformir(ProgramId, OperationId, file){

    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'UpdateProgramStatusInformir',
            ProgramId : ProgramId,
            OperationId : OperationId,
            file : file,
        },
        success: function (response){
            //Debug('----------UpdateProgramStatusInformir----------');
            Debug(response);
        }
    });
}

function UpdateProgramStreamIdInformir(ProgramId, OperationId, StreamId){
    //Debug('--------->> UpdateProgramStreamid= '+ ProgramId + ', ' + OperationId + ', '+StreamId);
    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'UpdateProgramStreamId',
            ProgramId : ProgramId,
            OperationId : OperationId,
            StreamId : (StreamId == 0)? '0':StreamId
        },
        success: function (response){
            //Debug('----------UpdateProgramStreamid----------');
            Debug(response);
        }
    });
}

function UpdateProgramDeleteInformir(ProgramId, OperationId, AssetId){

    $.ajax({
        type: 'POST',
        url: 'Core/Controllers/Recorder.php',
        data: {
            Option     : 'UpdateProgramStatusDelete',
            ProgramId : ProgramId,
            OperationId : OperationId,
            AssetId : AssetId
        },
        success: function (response){
            //Debug('----------UpdateProgramDelete----------');
            Debug(response);
        }
    });
}
/*******************************************************************************
 * Carga inicial con funciones para el DVR
 *******************************************************************************/

 if(Device['Type'] === 'WHP_HDDY' || Device['Type'] === 'PVR_ONLY'){
    pvrManager.SetMaxRecordingCnt(4);
    GetProgramsToScheduleAfterRebootInformir();
    HandlerPvrInformir();
    Debug("------>DESPUES");
    UpdateDiskInfoInformir();
    Debug("------>DESPUES UPDATE");
    //GetProgramsSerie();
    Debug("------>DESPUES GET PROGRAM");

}

function HandlerPvrInformir(){
    
    GetProgramsSerie();

    GetProgramsToScheduleInformir();

    GetSchedulesToDeleteInformir();
    
    setTimeout(HandlerPvrInformir,30000);
    
}
