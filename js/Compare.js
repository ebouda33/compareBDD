/* 
 * Object pour comparer
 */


function Compare () {
    var me = this;
    me.ajaxEnCours = 0;
    
    me.listeParametres = {};
    me.dialogParametre = {};
    
    me.fn = {
        remplir : {
            selectObject : function(select,tableau){
                $('#'+select+' option').remove();
                $.each(tableau,function(cle,value){

                    $.each(value,function(dbname,taille){
                        libel = "<b>"+cle+"</b>/"+dbname+" => "+taille;
                        option = JSON.stringify({'env':cle,'dbname':dbname});
                        $('#'+select).append('<option value=\''+option+'\' class=\''+cle+'\'>'+libel+'</option>');
                    });
                });
            },
        },
        getBDD : function(id){
            combo = $('#'+id);
            select = $('#'+id+' option:selected');
            if(select.length > 0){
                var liste = [];
                for(var i = 0; i< select.length ;i++){
                    liste.push(select[i].value);
                }

                me.envoyer('json.php',{'demande':'get_'+id,'liste':false,'data':liste},me.successBDD2,me.failure,'JSON',"POST","","Attente");
            }
            if(combo[0].length === 0){
                me.envoyer('json.php',{'demande':'get_'+id,'liste':true},me.successBDD,me.failure,'JSON',"POST","","Attente");
            }
        },
        select : function(select,tableau){
            $('#'+select+' option').remove();
            $.each(tableau,function(index){
                $('#'+select).append('<option value="'+tableau[index]+'" >'+tableau[index]+'</option>');
            });
        },

        
        refresh_log : function(){
            //recherche du fichier log
            me.envoyer('json.php',{'demande':'refresh_log'},me.successRefreshLog,me.failureRefreshLog,'HTML',"POST","Test connection","Attente");
        },
        onchangeSelect : function(id,bt){
    
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
        },
    }
    
    me.setParametersSQL = {
      SUCCESS : function(data){
        console.log(data);
        console.log("success set parametre");
        me.dialogParametre.close();
      },
      FAILURE : function(data){
            console.log(data);
            console.log("failure set parametre");
            me.dialogParametre.close();
      },  
      save : function(){
        //recuperation des parametres coches
        //gestion du tableau par double indexage, tables contient les cles de elements
        var form =  $('#form_parametres :input');

        var liste = me.listeParametres;
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
        me.listeParametres = liste;

        },
    },
    
    me.getParameterSQL = {
        getCookie : function(idForm){
            //recuperation du cookie avant chargement
            me.getCookie();

            //met a jour les champs en fonction de ce que l on a en cache
            var form = $('#'+idForm +" :input");

            //test si la table affiche est connu du cookie
            var table = form[0].value ;
            if($.inArray(table,me.listeParametres.tables) !== -1){
                //on traite

                var t_parametres = me.listeParametres.elements[table+"_parametres"];
                var t_primary = me.listeParametres.elements[table+"_primary"];
                var t_nullable = me.listeParametres.elements[table+"_nullable"];
                form.each(function(index,input){
                    if(input.type === "checkbox"){
                        var champ = input.value;
                        var type = input.name;
                        var tableau = t_parametres;
                        //pour eviter un eval de la variable
                        if(type === 'primary' ){
                            tableau = t_primary;
                        }else if(type === 'nullable' ){
                            tableau = t_nullable;
                        }
                        
                        if($.inArray(champ,tableau) !== -1){
                            input.checked = true;
                        }else{
                            input.checked = false;
                        }
                    }

                });
            }
        },
        SUCCESS :function(data){
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
                    me.setParametersSQL.save();
                    var ok = me.controleParameter($( "#load_parametres :input[name|='table']" ).val());
                    if(!ok){
                        alert('Controle incorrect , verifier la selection d\'au moins un elements dans chaque colonne.');
                    }else{
                        cookie = me.dialogParametre.close();
                    }


        //            me.envoyer('json.php',{'demande':'setParametersSQL'},me.setParametersSQL.SUCCESS,me.setParametersSQL.FAILURE,'JSON',"POST","Test connection","Attente");
                },
                Cancel: function() {
                  me.dialogParametre.close();
                }
              }
            } 
            );

            me.getParameterSQL.getCookie('load_parametres');
        },
        FAILURE : function(data){
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

                 me.dialogParametre.close();
                }
                }
            } 
            );
        }

    };
    me.compare = {
      SUCCESS : function(data)  {
          //creation du tabbedpane dans la zone prevu
          tabsGlobale.__create(data);
          
      },
      FAILURE : function(data)  {
          $( "#dialog-confirm" ).html("Erreur de données du serveur");
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

                  }
                }
        });
      },
      execute : function(){
        //lance la comparaison avec les parametres definis.
        //    verifie elements cochable dans bdd_sql_compare_vue
            var checkbox = $('#bdd_sql_compare_vue :checkbox');
            me.getCookie();
            me.listeParametres.tableCompare = [];
            checkbox.each(function(index,input){
                            if(input.checked)   {
                                me.listeParametres.tableCompare.push(input.id);
                            }
                        }
                   );

           if(me.listeParametres.tableCompare.length > 0){
               //prevenir des valeurs par defaut que nous allons comparer
               var liste = "";
               var tableComparaison = '';
               for(var i=0; i <me.listeParametres.tableCompare.length ;i++){
                   var value = me.listeParametres.tableCompare[i];
                   tableComparaison +=  value+", ";
                   if($.inArray(value,me.listeParametres.tables) === -1){
                       liste = liste + value+", ";
                   }
               }
               var msg = "";
               if(liste !== ""){
                   liste = liste.substr(0,liste.length-2);
                   msg = 'Cette table ('+liste+') utilisera';
                   if(liste.indexOf(",")!==-1){
                    msg = 'Ces tables ('+liste+') utiliserons';
                    }
                    msg += ' les paramètres par défaut';

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
                                  me.compare.executeALL();
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
        },
      executeALL : function(){
          for(var i=0;i< me.listeParametres.tableCompare.length ;i++){
              var table = me.listeParametres.tableCompare[i];
              var elt ={
                    table:table,
                    elements:[],
                    primary:[],
                    nullable:[]
                };
              if($.inArray(table,me.listeParametres.tables) !== -1){
                
                    elt.elements =me.listeParametres.elements[table+'_parametres'];
                    elt.primary = me.listeParametres.elements[table+'_primary'];
                    elt.nullable = me.listeParametres.elements[table+'_nullable'];
                
               }
              me.compare.executeUnitaire(elt);
          }
      }  ,
      executeUnitaire : function(elt){
        var data = {
            demande : 'compare' ,
            elt : elt
            
        };
        me.envoyer('json.php',data,me.compare.SUCCESS,me.compare.FAILURE);
      }
    };
    
    
    me.connexionPROD = function (){
        //controle la connexion a prod
        me.envoyer('json.php',{'demande':'test_prod'},me.success,me.failureCNX,'JSON',"POST","Test connection","Attente");
    };
    
    me.envoyer = function (url,data,callBackSuccess,callBackFailure,type,method,title,message){
        Ajax.envoyer(url,data,callBackSuccess,callBackFailure,type,method,title,message);
    };
    
    me.fichierSQL = function (){
        me.envoyer('json.php',{'demande':'files_sql_log'},me.successFileSQL,me.failureSQL,'JSON',"POST","Test connection","Attente");
        me.envoyer('json.php',{'demande':'files_sql_save'},me.successFileSQL,me.failureSQL,'JSON',"POST","Test connection","Attente");
    
    };
    
    me.fichierLocal = function(){
        me.envoyer('json.php',{'demande':'file_local'},me.successFileLocal,me.failureFileLocal,'JSON',"POST","Test connection","Attente");
        me.envoyer('json.php',{'demande':'file_local_sql'},me.successFileLocalSQL,me.failureFileLocalSQL,'JSON',"POST","Test connection","Attente");
        me.envoyer('json.php',{'demande':'file_local_sql_save'},me.successFileLocalSQL,me.failureFileLocalSQL,'JSON',"POST","Test connection","Attente");
        
    };
    
    
    me.failureCNX = function(data){
        $('#maskLoader').html("<span style='color:red;'>"+data.msgErreur+" <a href='http://shp.itn.ftgroup/sites/CACTUS/Support/Support_FR_Login_URLs.aspx' target='_blank'>CACTUS</a></span>");
    
    };
    me.failure = function(data){
        me.failureCNX(data);
        $('#bt_tranfert').attr('disabled',false);
    };
    
    me.success = function(data){
        if(data !== undefined && data !== null){
            me.dataPart = data;
        }
        $('#maskLoader').removeClass("loader");
        $('#maskLoader').html("<span style='color:blue;'>Récupération du contenu OK</span>");
        var partenaires = me.dataPart.partenaires;
        $.each(partenaires,function(index){
            if(partenaires[index].label !== undefined){
                $('#partenaire').append('<option value="'+index+'" >'+partenaires[index].label+'</option>');
            }
        });
    };
    
    me.successBDD = function(data){
        $('#maskLoader').html("<span style='color:blue;'>Liste OK</span>");
        $('#maskLoader').removeClass("transfert_file");
        $('#maskLoader').removeClass("loader");
        me.fn.remplir.selectObject('bdd_sql_compare',data.bdd);

        //me.envoyer('json.php',{'demande':'file_local'},me.successFileLocal,me.failureFileLocal,'JSON',"POST","Test connection","Attente");

    };
    me.successBDD2 = function(data){
    //    var id = data.type.replace('get_','');
    //    me.deselectCombo(id);
        var html = $('.droite').html();
        $('.droite').html(html.replace('En Attente de BDD ',''));
        $('#bdd_sql_compare_vue').html(data.vue);
    };
    
    me.successRefreshLog = function(data){
        var log = $('#bdd_sql_compare_log');
        log[0] .innerHTML = data;
      };

    me.failureRefreshLog = function(data){
    var log = $('#bdd_sql_compare_log');
    log[0] .innerHTML = 'Erreur lecture Log:'+data;
  };
    
    me.deselectCombo = function(id){
        //var id = data.type.replace('get_','');
       if($('#'+id+' option:selected').length>0){
           $('#'+id+' option:selected').prop('selected',false);
       }
       var bt = 'bt_'+id ;
       $('#'+bt).attr('disabled','disabled');
       $('#'+bt+"_2").attr('disabled','disabled');
   };
    me.getParametersSQL = function(table){
        //bloquer ecran pour pas faire de betise
        me.dialogParametre.close();
        me.bloqueEcran();
        me.envoyer('json.php',{'demande':'getParametersSQL','table':table},me.getParameterSQL.SUCCESS,me.getParameterSQL.FAILURE,'JSON',"POST","Test connection","Attente");
    };
    
    
    
    me.bloqueEcran = function(){
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
    
    
    me.controleParameter = function(table){
        var ok = false;
        if(table === undefined){
            alert('Erreur sur le controle des donnees , veuillez recommencer');
        }else{
            ok = (me.listeParametres.elements[table+'_parametres'].length > 0)?true:false;
            ok = (me.listeParametres.elements[table+'_primary'].length > 0)?ok && true: ok && false;
        }
        if(ok){
            $.jCookies({
                name : 'parametres',
                value : me.listeParametres,
                days : 100
            });
        }
        return ok;

    };
    
    me.selectTable = function(){
        var bt = 'bt_bdd_sql_compare_2';

        $('#'+bt).removeAttr('disabled');
    };
    
   
    
    me.getCookie = function(){
        var c1 = $.jCookies({get: 'parametres'});

        if (c1 !== false) {
            me.listeParametres = c1;
        }
    };
    
    me.listeParametres.init = function(){
        me.listeParametres.tables = [];
        me.listeParametres.elements = {};
        me.listeParametres.tableCompare = [];
    };
    
    
    me.dialogParametre.close = function(){
    
        if($("#load_parametres").hasClass('ui-dialog-content') && $( "#load_parametres" ).dialog( "isOpen" ) === true){
            $( "#load_parametres" ).dialog( "close" );
            $( "#load_parametres" ).html("");
            $(".ui-widget-header").hide();
        }
    };
};


