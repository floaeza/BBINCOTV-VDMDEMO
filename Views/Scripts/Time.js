// @ts-nocheck
/******************************************************************************
 * @Objetivo: Actualiza la hora
 * @CreadoPor: Tania Maldonado
 * @Fecha: Noviembre 2019
 *******************************************************************************/

/* Validacion para reinicar dispositivo y buscar actualizaciones de la epg */
    var TimeRunning       = 0,
        MaxMinutesRunning = 15,
        TimerDate         = 0,
        Offset            = 0;

    var cade = null;


    /* Valida la diferencia de horas en Samsung */

    if (window.tizen !== undefined) {
        var now = new tizen.TZDate(),
            TvHour = now.getHours();

        Debug('------------------------- NOW:::: '+now);

        $.ajax({
            type: 'POST',
            url: 'http://'+ServerIp+'/BBINCO/TV/Core/Models/Time.php',
            async : false,
            success: function (response) {
                var Today = $.parseJSON(response),
                    ServerHour   = Today.Hours;

                Debug('****************************************** > '+TvHour);
                Debug('****************************************** > '+ServerHour);

                Offset = parseInt(TvHour) - parseInt(ServerHour);

                Debug(':::::::::::::::::::::::::::::OFFSET:: '+Offset);

                Today = null;
                ServerHour = null;
            }
        });

        now = null;
        TvHour = null;
    }

/*******************************************************************************
 * Funcion que escribe la fecha actual en la EPG, esta funcion tiene un timer
 * para actualizar fecha y hora infinitamente
 *******************************************************************************/
    
    function SetDate(){
        TimeRunning++;
        
        FormatDateAndHour = moment().subtract(Offset, 'hours').format('MMM, DD / h:mm A');
        CurrentStbDate = moment().subtract(Offset, 'hours').format('Y-MM-DD h:mm:ss');
		if(typeof(ASTB) !== 'undefined'){ Browser.CacheFlush(); }

        //Debug('################################################ FormatDateAndHour '+FormatDateAndHour);
        //Debug('################################################ CurrentStbDate '+CurrentStbDate);

        if(!Device){
            Debug('------------------------------------------------ Device::if');
            //Debug('################################################ !Device ');
            if (Device.Client === 'CHL') {
                Debug("+++++++++++++++++++++++++++++++++++++++");
                FormatHour = moment().subtract(Offset, 'hours').format('h:mm A');
            } else {
                FormatHour = moment().subtract(Offset, 'hours').format('MMMM Do h:mm a');
                //Debug('------------------------------------------------ 2');
            }
        } else {
            FormatHour = moment().subtract(Offset, 'hours').format('h:mm A');
            Debug('------------------------------------------------ Device::else');
        }

        Debug('############################################################### FormatHour1 === '+FormatHour);


        if(CurrentModule === 'Tv'){

            Debug('############################################################### CurrentModule === '+CurrentModule);
            if(typeof (ActiveInfoContainer) !== 'undefined' && ActiveInfoContainer === true){
                InfoContainerNodes[7].textContent  = FormatHour;
            } else if(typeof (ActiveEpgContainer) !== 'undefined' && ActiveEpgContainer === true){
                EpgDate.textContent = FormatDateAndHour;
            } else if(typeof (RecordingPanel) !== 'undefined' && RecordingPanel === true){
                PvrDate.textContent = FormatHour;
            }

            Debug('############################################################### FormatHour2 === '+FormatHour);

            cade = FormatHour.split(":");

            if(cade[1] == '01 AM' || cade[1] == '01 PM' || cade[1] == '31 AM' || cade[1] == '31 PM'){
                clearInterval(TimerDate);
                TimerDate = setInterval(SetDate, 50000);
                cade = null;
            }


            if(FormatHour === '12:01 AM'){

                SetEpgFile();
                Debug('------------------------------ SetEpgFile -> FormatHour: '+FormatHour);

                if(Device['Type'] === 'WHP_HDDY' || Device['Type'] === 'PVR_ONLY'){
                    if(EpgDataActive === true){
                        GetProgramsSerie();
                    }
                }
            }

        } else if(CurrentModule === 'Menu' || CurrentModule === 'Movies'){
            FormatDate = moment().subtract(Offset, 'hours').format('MMM DD ');
            FormatHour = moment().subtract(Offset, 'hours').format('h:mm a');
        
            MenuDate.textContent = FormatDate;
            MenuHour.textContent = FormatHour;
        }

        
        /* */

        Debug('TimeRunning: '+TimeRunning);
        if(TimeRunning > MaxMinutesRunning){
            
            TimeRunning = 0;

            if(Executing === false){
                if(CurrentModule !== 'Tv') {
                    UpdateInfoDevice();
                } else {
                    UpdateQuickInfoDevice();
                }
            }
        }
        Debug('-------------------------------- FormatDateAndHour: '+FormatDateAndHour);
    }

/*******************************************************************************
 * Activa timer para que se ejecute cada minuto (60000 milisegundos = 60 segundos)
 *******************************************************************************/
    /* Lo ejecuta la primera vez que carga */
    setTimeout(SetDate,1000);
    
    /* Agrega intervalo 50000 = 50 segundos*/
    
    TimerDate = setInterval(SetDate, 50000);

