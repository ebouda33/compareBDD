/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
		
$(document).ready(function() {
    tabsGlobale = new Tabs("#tabs");
            
    compare = new Compare();
    compare.fn.getBDD('bdd_sql_compare',true);
    compare.listeParametres.init();
    
    Split(['.ui-layout-center', '.ui-layout-south'], {
        direction: 'vertical',
        sizes: [44, 56],
        gutterSize: 8,
        cursor: 'row-resize'
      });
      
      
      tabsGlobale.widget.on( "click"," span.ui-icon-close", function(){
        var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
          $( "#" + panelId ).remove();
          tabsGlobale.widget.tabs( "refresh" );  
          tabsGlobale.close();
      });
});

/**
if(typeof COMPARE === "undefined"){
        COMPARE = {};
    }
    if(typeof COMPARE.fn === "undefined"){
        COMPARE.fn = {};
    }
    if(typeof COMPARE.fn.remplir === "undefined"){
        COMPARE.fn.remplir = {};
    }
    COMPARE.setParametersSQL = {};
    COMPARE.getParameterSQL = {};
    COMPARE.listeParametres = {};
    COMPARE.dialogParametre = {};
    
    
    
    COMPARE.connexionPROD = function (){
        //controle la connexion a prod
        COMPARE.envoyer('json.php',{'demande':'test_prod'},COMPARE.success,COMPARE.failureCNX,'JSON',"POST","Test connection","Attente");
    };

    COMPARE.fichierLocal = function(){
        COMPARE.envoyer('json.php',{'demande':'file_local'},COMPARE.successFileLocal,COMPARE.failureFileLocal,'JSON',"POST","Test connection","Attente");
        COMPARE.envoyer('json.php',{'demande':'file_local_sql'},COMPARE.successFileLocalSQL,COMPARE.failureFileLocalSQL,'JSON',"POST","Test connection","Attente");
        COMPARE.envoyer('json.php',{'demande':'file_local_sql_save'},COMPARE.successFileLocalSQL,COMPARE.failureFileLocalSQL,'JSON',"POST","Test connection","Attente");
        
    };
    
    COMPARE.popup = function(){
        
    };
    COMPARE.ajaxEnCours = 0;
    COMPARE.envoyer = function (url,data,callBackSuccess,callBackFailure,type,method,title,message){
        var me = this;
        me.type = type || 'JSON';
        me.method = method || 'POST';
        me.data = data;
        me.url = url;
        me.title = title|| 'Traitement';
        me.message = message || "Merci de patienter";
        $.ajax({
                        url: me.url,
                        type: me.method,
                        async: true,
                        data: me.data,
                        dataType : me.type,
                        success: function (data) {
                            e = data;
                            if((data.success !== undefined && data.success === true) || (me.type === 'HTML')){
                                    if(callBackSuccess !== undefined){
                                            callBackSuccess(data);
                                    }
                                    
                            }else{
                                    if(callBackFailure !== undefined){
                                            callBackFailure(data);
                                    }
                                    
                            }
                            if (COMPARE.ajaxEnCours === 1) {
                                    me.fen.closeAlert();
                            }
                            COMPARE.ajaxEnCours--;
                        },
                        error: function (data) {
                            if(callBackFailure !== undefined){
                                    callBackFailure(data);
                            }
                            if (COMPARE.ajaxEnCours === 1) {
                                    me.fen.closeAlert();
                            }
                            COMPARE.ajaxEnCours--;	
                        }
             });
    };



COMPARE.fichierSQL = function (){
    COMPARE.envoyer('json.php',{'demande':'files_sql_log'},COMPARE.successFileSQL,COMPARE.failureSQL,'JSON',"POST","Test connection","Attente");
    COMPARE.envoyer('json.php',{'demande':'files_sql_save'},COMPARE.successFileSQL,COMPARE.failureSQL,'JSON',"POST","Test connection","Attente");
    
};

COMPARE.successFileSQL = function(data){
    COMPARE.fn.remplir.select(data.type,data.files);
};

COMPARE.failureSQL = function(){};


COMPARE.failureCNX = function(data){
    $('#maskLoader').html("<span style='color:red;'>"+data.msgErreur+" <a href='http://shp.itn.ftgroup/sites/CACTUS/Support/Support_FR_Login_URLs.aspx' target='_blank'>CACTUS</a></span>");
    
};
COMPARE.failure = function(data){
    COMPARE.failureCNX(data);
    $('#bt_tranfert').attr('disabled',false);
};


COMPARE.success = function(data){
    if(data !== undefined && data !== null){
        COMPARE.dataPart = data;
    }
    $('#maskLoader').removeClass("loader");
    $('#maskLoader').html("<span style='color:blue;'>Récupération du contenu OK</span>");
    var partenaires = COMPARE.dataPart.partenaires;
    $.each(partenaires,function(index){
        if(partenaires[index].label !== undefined){
            $('#partenaire').append('<option value="'+index+'" >'+partenaires[index].label+'</option>');
        }
    });
    
    
};



COMPARE.fn.coche = function(ref,id){
    if(ref.checked){
        $("."+id).prop('checked', true);
    }else{
        $("."+id).removeProp('checked');
    }
};

COMPARE.fn.destruct = function(checkbox){
     var liste = $("."+checkbox);
    if($("."+checkbox).is(':checked')){
       
        var listeFiles = [];
        for(i=0;i< liste.length;i++){
            if(liste[i].checked){
                listeFiles.push(liste[i].value);
            }
        }
        
        //console.log(listeFiles );
        COMPARE.envoyer('json.php',{'demande':'file_delete',data:listeFiles},COMPARE.successFile_delete,COMPARE.failure_delete,'JSON',"POST","Test connection","Attente");
    }else{
        if(liste.length > 0){
            alert("Selectionnez un fichier à supprimer. Gros NAze");
        }
    }
};

COMPARE.successFile_delete =  function(data){
    COMPARE.fichierLocal();
};

COMPARE.failure_delete = function(data){
    alert('erreur de suppression =>'+data.msgErreur);
};


COMPARE.failureFileLocal = function(data){
     var div = '#local';
    $(div).html("<span style='color:red;'>"+data.msgErreur+"</span>");
    
};

COMPARE.successFileLocal = function(data){
    
    var div = '#local';
    
    COMPARE.fn.successFileLocal(div,data);
    
};

COMPARE.fn.successFileLocal = function(div,data){
    var name = div.replace('#','_');
    var txt = "";
    txt += "<table class='files'>";
    txt +="<tr>";
        txt +="<td colspan=2 class='left'><input type='checkbox' value='ALL' onclick='COMPARE.fn.coche(this,\"radio_files"+name+"\")'>TOUT/RIEN</td>";
//        txt +="<td>&nbsp;</td>";
        txt +="</tr>";
    var remplir = false;
    for(var i =0 ;i<data.files.length;i++){
        if(data.files[i].name.indexOf('sql') > 0 && div === '#local_sql_save'){
            remplir = true;
        }
        if(data.files[i].name.indexOf('sql') === -1 && div !== '#local_sql_save'){
            remplir = true;
        }
        
        if(remplir){
            txt +="<tr>";
            txt +="<td class='left'><input id='radio_files"+name+"[]' name='radio_files[]' class='radio_files"+name+"' type='checkbox' value='"+data.files[i].name+"'></td>";
            txt +="<td>"+data.files[i].name+"</td>";
            txt +="</tr>";
        }
        remplir = false;
        
        
    }
    txt += "</table>";
    $(div).html("<span>"+txt+"</span>");
    
    $(div).append('<input type=button value="detruire" onclick=\'COMPARE.fn.destruct("radio_files'+name+'")\'/>');
};

COMPARE.failureFileLocalSQL = function(data){
     var div = '#local_sql';
     if(data.demande === 'file_local_sql_save'){
        div = '#local_sql_save';
    }
    $(div).html("<span style='color:red;'>"+data.msgErreur+"</span>");
    
};

COMPARE.successFileLocalSQL = function(data){
    
    var div = '#local_sql';
    if(data.demande === 'file_local_sql_save'){
        div = '#local_sql_save';
    }
    COMPARE.fn.successFileLocal(div,data);
    
};

COMPARE.successFile = function(data){
    COMPARE.dataFile = data;
    var txt = '';
    for(var i =0; i< COMPARE.dataFile.file.length;i++){
        txt = COMPARE.dataFile.file[i]+'<br>';
    }
    $('#maskLoader').html("<span style='color:blue;'>Fichiers OK "+txt+"</span>");
    $('#maskLoader').removeClass("transfert_file");
    $('#bt_tranfert').attr('disabled',false);
    
    
    COMPARE.envoyer('json.php',{'demande':'file_local'},COMPARE.successFileLocal,COMPARE.failureFileLocal,'JSON',"POST","Test connection","Attente");
    
    
};

COMPARE.onchangePartenaire = function(element){
    var part = element.value;
    var tableau = COMPARE.dataPart.partenaires[part].flux;
    $('#flux option').remove();
    $('#files option').remove();
    $('#flux').append('<option value="" ></option>');
    $.each(tableau,function(index){
        if(index !== undefined){
            $('#flux').append('<option value="'+index+'" >'+index+'</option>');
        }
    });
};


COMPARE.onchangeFlux = function(element){
    var part = $('#partenaire').val();
    var flux = element.value;
    var tableau = COMPARE.dataPart.partenaires[part].flux[flux];
    
    COMPARE.fn.remplir.select('files',tableau);
    
};


COMPARE.selectMachines = function(element,bt){
    
    COMPARE.fn.onchangeSelect(element,bt);
};

COMPARE.fn.onchangeSelect = function(id,bt){
    
    if($('#'+id+' option:selected').length>0){
        if($('#'+id+' option:selected').length === 2){
            $('#'+bt).removeAttr('disabled');
        }else{
            if($('#'+id+' option:selected').length > 2){
                alert('Il faut sélectionner deux BDD!!');
            }
            $('#'+bt).attr('disabled','disabled');
        }
    }else{
        $('#'+bt).attr('disabled','disabled');
    }
    
    $('#'+bt+"_2").attr('disabled','disabled');
};


COMPARE.TRANSFERT = function(){
    $('#maskLoader').html("<span style='color:green;'>Transfert en Cours ...</span>");
    $('#maskLoader').addClass("transfert_file");
    //demande le fichier a transferer
    var _files = $('#files option:selected');
    var _part = $('#partenaire').val();
    var _flux = $('#flux').val();
    var _machine = $('#machine option:selected');
    var files = [];
    var machines = [];
    
    for(var i =0 ; i < _machine.length; i++){
        machines.push(_machine[i].value);
    }
    for(var i =0 ; i < _files.length; i++){
        files.push({partenaire: _part , flux: _flux, file : _files[i].value,dest:machines});
    }
    
    $('#bt_tranfert').attr('disabled',true);
    COMPARE.envoyer('json.php',{'demande':'file',data:files},COMPARE.successFile,COMPARE.failure,'JSON',"POST","Test connection","Attente");
    
};



COMPARE.fn.remplir.select = function(select,tableau){
    $('#'+select+' option').remove();
    $.each(tableau,function(index){
        $('#'+select).append('<option value="'+tableau[index]+'" >'+tableau[index]+'</option>');
    });
};

COMPARE.fn.remplir.selectObject = function(select,tableau){
    $('#'+select+' option').remove();
//    console.log(tableau);
    $.each(tableau,function(cle,value){
        
        $.each(value,function(dbname,taille){
            libel = "<b>"+cle+"</b>/"+dbname+" => "+taille;
            option = JSON.stringify({'env':cle,'dbname':dbname});
            $('#'+select).append('<option value=\''+option+'\' class=\''+cle+'\'>'+libel+'</option>');
        });
    });
};


COMPARE.fn.Download = function(bt,id){
   bt.disabled = true;
    $( ".iframeDL" ).remove();
  var liste = $('#'+id+' option:selected');
  for(i=0;i<liste.length;i++){
//      $iframe = $("<iframe style='display: none' class='iframeDL' src='about:blank'></iframe>").appendTo("body");
//      var formDoc = COMPARE.fn.getiframeDocument($iframe);
//      var formInnerHtml = "";
//      formInnerHtml += '<input type="hidden" name="data" value="' + liste[i].value + '" />';
//      formInnerHtml += '<input type="hidden" name="demande" value="get_'+id + '" />';
//      formDoc.write("<html><head></head><body><form method='POST' action='download.php'>"+formInnerHtml+"</form></body></html>");
//      $form = $(formDoc).find('form');
//      $form.submit();        
       
       
      COMPARE.envoyer('download.php',{'demande':'get_'+id,data:liste[i].value},COMPARE.successFileSQL,COMPARE.failureSQL,'JSON',"POST","Test connection","Attente");
  }
  

  
  
};


 COMPARE.fn.getiframeDocument = function ($iframe) {
            var iframeDoc = $iframe[0].contentWindow || $iframe[0].contentDocument;
            if (iframeDoc.document) {
                iframeDoc = iframeDoc.document;
            }
            return iframeDoc;
};


COMPARE.fn.getBDD = function(id){
    combo = $('#'+id);
    select = $('#'+id+' option:selected');
    if(select.length > 0){
        var liste = [];
        for(var i = 0; i< select.length ;i++){
            liste.push(select[i].value);
        }
        
        COMPARE.envoyer('json.php',{'demande':'get_'+id,'liste':false,'data':liste},COMPARE.successBDD2,COMPARE.failure,'JSON',"POST","","Attente");
    }
    if(combo[0].length === 0){
        COMPARE.envoyer('json.php',{'demande':'get_'+id,'liste':true},COMPARE.successBDD,COMPARE.failure,'JSON',"POST","","Attente");
    }
};

COMPARE.successBDD = function(data){
    $('#maskLoader').html("<span style='color:blue;'>Liste OK</span>");
    $('#maskLoader').removeClass("transfert_file");
    $('#maskLoader').removeClass("loader");
    COMPARE.fn.remplir.selectObject('bdd_sql_compare',data.bdd);
    
    //COMPARE.envoyer('json.php',{'demande':'file_local'},COMPARE.successFileLocal,COMPARE.failureFileLocal,'JSON',"POST","Test connection","Attente");
    
};
COMPARE.successBDD2 = function(data){
//    var id = data.type.replace('get_','');
//    COMPARE.deselectCombo(id);
    var html = $('.droite').html();
    $('.droite').html(html.replace('En Attente de BDD ',''));
    $('#bdd_sql_compare_vue').html(data.vue);
};

COMPARE.fn.refresh_log = function(){
  //recherche du fichier log
  COMPARE.envoyer('json.php',{'demande':'refresh_log'},COMPARE.successRefreshLog,COMPARE.failureRefreshLog,'HTML',"POST","Test connection","Attente");
};

COMPARE.successRefreshLog = function(data){
  var log = $('#bdd_sql_compare_log');
  log[0] .innerHTML = data;
};

COMPARE.failureRefreshLog = function(data){
  var log = $('#bdd_sql_compare_log');
  log[0] .innerHTML = 'Erreur lecture Log:'+data;
};


COMPARE.deselectCombo = function(id){
     //var id = data.type.replace('get_','');
    if($('#'+id+' option:selected').length>0){
        $('#'+id+' option:selected').prop('selected',false);
    }
    var bt = 'bt_'+id ;
    $('#'+bt).attr('disabled','disabled');
    $('#'+bt+"_2").attr('disabled','disabled');
};


COMPARE.getParametersSQL = function(table){
    //bloquer ecran pour pas faire de betise
    COMPARE.dialogParametre.close();
    COMPARE.bloqueEcran();
    COMPARE.envoyer('json.php',{'demande':'getParametersSQL','table':table},COMPARE.getParametersSQL.SUCCESS,COMPARE.getParametersSQL.FAILURE,'JSON',"POST","Test connection","Attente");
};

COMPARE.bloqueEcran = function(){
    $( "#load_parametres" ).html( "Chargement en Cours ...");
    $( "#load_parametres" ).dialog(
    {
      autoOpen: true,      
      resizable: false,
       height: 40,
      closeOnEscape: false,
      modal: true,
     create: function (event, ui) {
        $(".ui-widget-header").hide();
    },buttons: {
      
      }
    }
    );
};


COMPARE.getParametersSQL.SUCCESS = function(data){
    //modifier les data en fonction de ce qui est sauvegarde.
    $( "#load_parametres" ).html( data.vue);
    $(".ui-widget-header").show();
    $( "#load_parametres" ).dialog(
    {
      autoOpen: true,      
      resizable: true,
      height: 400,
      width: 400,
      modal: true,
      title : 'Parametres de la Comparaison',
     closeOnEscape: true,
     
      buttons: {
        Valider : function(){
            //controle coherence;
            COMPARE.setParametersSQL.save();
            var ok = COMPARE.controleParameter($( "#load_parametres :input[name|='table']" ).val());
            if(!ok){
                alert('Controle incorrect , verifier la selection d\'au moins un elements dans chaque colonne.');
            }else{
                cookie = COMPARE.dialogParametre.close();
            }
           
           
//            COMPARE.envoyer('json.php',{'demande':'setParametersSQL'},COMPARE.setParametersSQL.SUCCESS,COMPARE.setParametersSQL.FAILURE,'JSON',"POST","Test connection","Attente");
        },
        Cancel: function() {
          COMPARE.dialogParametre.close();
        }
      }
    } 
    );
    
    COMPARE.getParameterSQL.getCookie('load_parametres');
};

COMPARE.getParametersSQL.FAILURE = function(data){
    $( "#load_parametres" ).html( "Erreur Parametres.");
    $(".ui-widget-header").hide();
    $( "#load_parametres" ).dialog(
    {
      autoOpen: false,      
      resizable: false,
      height: 100,
      modal: true,
      title : 'Parametres de la Comparaison',
        closeOnEscape: true,
      buttons: {
        Ok : function(){
         
         COMPARE.dialogParametre.close();
        }
        }
    } 
    );
};


COMPARE.controleParameter = function(table){
    var ok = false;
    if(table === undefined){
        alert('Erreur sur le controle des donnees , veuillez recommencer');
    }else{
        ok = (COMPARE.listeParametres.elements[table+'_parametres'].length > 0)?true:false;
        ok = (COMPARE.listeParametres.elements[table+'_primary'].length > 0)?ok && true: ok && false;
    }
    if(ok){
        $.jCookies({
            name : 'parametres',
            value : COMPARE.listeParametres,
            days : 100
        });
    }
    return ok;
    
};


COMPARE.selectTable = function(){
    var bt = 'bt_bdd_sql_compare_2';
    
    $('#'+bt).removeAttr('disabled');
};

COMPARE.fn.compare= function(){
    //lance la comparaison avec les parametres definis.
//    verifie elements cochable dans bdd_sql_compare_vue
    var checkbox = $('#bdd_sql_compare_vue :checkbox');
    COMPARE.getCookie();
    COMPARE.listeParametres.tableCompare = [];
    checkbox.each(function(index,input){
                    if(input.checked)   {
                        COMPARE.listeParametres.tableCompare.push(input.id);
                    }
                }
           );
   
   if(COMPARE.listeParametres.tableCompare.length > 0){
       //prevenir des valeurs par defaut que nous allons comparer
       var liste = "";
       var tableComparaison = '';
       for(var i=0; i <COMPARE.listeParametres.tableCompare.length ;i++){
           var value = COMPARE.listeParametres.tableCompare[i];
           tableComparaison +=  value+", ";
           if($.inArray(value,COMPARE.listeParametres.tables) === -1){
               liste = liste + value+", ";
           }
       }
       var msg = "";
       if(liste !== ""){
           liste = liste.substr(0,liste.length-2);
           msg = 'Cette table ('+liste+') utilisera les paramètres par défaut';
           if(liste.indexOf(",")!==-1){
            msg = 'Ces tables ('+liste+') utiliserons les paramètres par défaut';
            }
                
       }
       var question  = "<b><i>"+msg+"</i></b><br><br>Lancez la comparaison ?";
       tableComparaison = tableComparaison.substr(0,tableComparaison.length-2);
       question += " "+tableComparaison;
            $( "#dialog-confirm" ).html(question);
            $( "#dialog-confirm" ).dialog({
                    autoOpen: true,
                    resizable: false,
                    height: "auto",
                    width: 300,
                    modal: true,
                    title:"Comparaison",
                    
                    show: {
                        effect: "blind",
                        duration: 1000
                      },
                      hide: {
                        effect: "explode",
                        duration: 1000
                      },
                    buttons: {
                      "OK": function() {
                        $( this ).dialog( "close" );
                      },
                      "Annuler": function() {
                        $( this ).dialog( "close" );
                      }
                    }
            });
   }else{
       alert('Séléctionner au moins une table à comparer');
   }
};

COMPARE.setParametersSQL.SUCCESS = function(data){
    console.log(data);
    console.log("success set parametre");
    COMPARE.dialogParametre.close();
};

COMPARE.setParametersSQL.FAILURE= function(data){
    console.log(data);
    console.log("failure set parametre");
    COMPARE.dialogParametre.close();
};

COMPARE.setParametersSQL.save= function(){
    //recuperation des parametres coches
    //gestion du tableau par double indexage, tables contient les cles de elements
    var form =  $('#form_parametres :input');
    
    var liste = COMPARE.listeParametres;
    var tableCourante = undefined;
    
    form.each(function(index,input){
        if(input.type === "checkbox"){
            var type = input.name;
            var value = input.value;
            if(liste.elements[tableCourante+"_"+type] === undefined){
                liste.elements[tableCourante+"_"+type] = [];
            }
            var i = $.inArray(value,liste.elements[tableCourante+"_"+type])
            if(input.checked){
                if(i === -1){
                    liste.elements[tableCourante+"_"+type].push(value);
                }
            }else{
                if(i !== -1){
                    liste.elements[tableCourante+"_"+type].splice(i,1);
                }
            }
        }else if(input.type === 'hidden' && input.name === 'table'){
            tableCourante = input.value;
            if($.inArray(tableCourante,liste.tables) === -1){
                liste.tables.push(tableCourante);
            }
        }
    });
    COMPARE.listeParametres = liste;
    
};

COMPARE.dialogParametre.close = function(){
    
    if($("#load_parametres").hasClass('ui-dialog-content') && $( "#load_parametres" ).dialog( "isOpen" ) === true){
        $( "#load_parametres" ).dialog( "close" );
        $( "#load_parametres" ).html("");
        $(".ui-widget-header").hide();
    }
};

COMPARE.getParameterSQL.getCookie = function(idForm){
    //recuperation du cookie avant chargement
    COMPARE.getCookie();
    
    //met a jour les champs en fonction de ce que l on a en cache
    var form = $('#'+idForm +" :input");
    
    //test si la table affiche est connu du cookie
    var table = form[0].value ;
    if($.inArray(table,COMPARE.listeParametres.tables) !== -1){
        //on traite
        
        var t_parametres = COMPARE.listeParametres.elements[table+"_parametres"];
        var t_primary = COMPARE.listeParametres.elements[table+"_primary"];;
        form.each(function(index,input){
            if(input.type === "checkbox"){
                var champ = input.value;
                var type = input.name;
                var tableau = t_parametres;
                //pour eviter un eval de la variable
                if(type === 'primary' ){
                    tableau = t_primary;
                }
                if($.inArray(champ,tableau) !== -1){
                    input.checked = true;
                }else{
                    input.checked = false;
                }
            }
            
        });
       
        
    }
    
};

COMPARE.getCookie = function(){
    var c1 = $.jCookies({get: 'parametres'});

    if (c1 !== false) {
        COMPARE.listeParametres = c1;
    }
}

COMPARE.listeParametres.init = function(){
    COMPARE.listeParametres.tables = [];
    COMPARE.listeParametres.elements = {};
    COMPARE.listeParametres.tableCompare = [];
}

*/