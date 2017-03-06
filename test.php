<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
 <?php
 /**
  * author xgld8274
  * pour admin SACRE sur PROD via CACTUS
  */
    require_once './init_autoloader.php';
 ?>
<html>
    <head>
        <title>COMPARAISON BDD</title>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <script src="jquery-ui-1.12.1.custom/external/jquery/jquery.js" ></script>
        <script src="jquery-ui-1.12.1.custom/jquery-ui.js" ></script>
        <script src="js/datepicker.js"></script>
        <script src="js/datepicker-fr.js"></script>
        <script src="js/jcookies/jcookies.js"></script>
         <script src="js/Compare.js"></script>
        <script src="js/Ajax.js"></script>
        <script src="js/Tabs.js"></script>
        <link href="jquery-ui-1.12.1.custom/jquery-ui.min.css" type="text/css" rel="stylesheet" />
        <link href="jquery-ui-1.12.1.custom/jquery-ui.structure.min.css" type="text/css" rel="stylesheet" />
        <link href="jquery-ui-1.12.1.custom/jquery-ui.theme.min.css" type="text/css" rel="stylesheet" />
        
        <link href="css/extract.css" type="text/css" rel="stylesheet" />
        
   
 
</head>

    <body>
        <div id="tabs" style="width: 100%;height: 100%;">
                  <ul id="ul_tabs">
                    
                  </ul>
                  
            </div>
            
        <script>
            tabsGlobale = new Tabs("#tabs");
            var data = {table:'eric',msg:'dkjskdlfjskdlfjsfjksdjklfksl',stabs:[]};
            tabsGlobale.__create(data);
            data = {table:'eric2',msg:'fhhtryeyeyreyreezetzete',stabs:[]};
            tabsGlobale.__create(data);
            
            
            tabsGlobale.widget.on( "click"," span.ui-icon-close", function(){
              var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
                $( "#" + panelId ).remove();
                tabsGlobale.widget.tabs( "refresh" );  
                tabsGlobale.close();
            });
//            tabsGlobale.widget.on( "click"," span.ui-icon-close", function(){
//                console.log(this);
//                var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
//            $( "#" + panelId ).remove();
//            tabsGlobale.widget.tabs( "refresh" );
//            });
        </script>
</body>

</html>



