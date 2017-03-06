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
        <script src="js/split.js"></script>
        <script src="js/Compare.js"></script>
        <script src="js/Ajax.js"></script>
        <script src="js/Tabs.js"></script>
        <script src="js/util.js"></script>
        <link href="jquery-ui-1.12.1.custom/jquery-ui.min.css" type="text/css" rel="stylesheet" />
        <link href="jquery-ui-1.12.1.custom/jquery-ui.structure.min.css" type="text/css" rel="stylesheet" />
        <link href="jquery-ui-1.12.1.custom/jquery-ui.theme.min.css" type="text/css" rel="stylesheet" />
        <link href="css/split.css" type="text/css" rel="stylesheet" />
        <link href="css/extract.css" type="text/css" rel="stylesheet" />
        
 
</head>

    <body>
        
            <div class='entete'>
                <div class="logo"></div>
                <div class='titre'>WELCOME ON COMPARE BDD FOR SACRE</div>
                <div id='maskLoader' class='loader '></div>
            </div>
            <div style="clear:both"></div>

    <!--<div id="a" class="a split split-horizontal">-->
    <div style="height: 85%"> 
        <div id="c" class="split content ui-layout-center">
            <div class='contenu2'> 

                    <div class='gauche w30'>
                        BDD dispo
                        <div >
                            <select id ='bdd_sql_compare' multiple size=16 class='bdd_sql_compare' onchange="compare.fn.onchangeSelect('bdd_sql_compare','bt_bdd_sql_compare')"></select>
                            <input id='bt_bdd_sql_compare' type="button"  value="Préparer" onclick="compare.fn.getBDD('bdd_sql_compare')" disabled="disabled"/>
                        </div>                       
                        <div style='float: right;'>
                           <input id='bt_bdd_sql_compare_2' type="button"  value="Comparer" onclick="compare.compare.execute();" disabled="disabled"/>
                        </div>
                    </div>
                    <div class='droite w70'>
                        En Attente de BDD 
                        <div id='refresh_log' onclick="EXTRACT.fn.refresh_log()"></div>
                       <div id='bdd_sql_compare_vue' class='bdd_sql_compare_vue'>

                       </div>
                   </div>
            </div>
        </div>
        <div id="d" class="split content ui-layout-south">
            Résultat De Comparaison par Table:<br>
            <div id="tabs" style="width: 100%;height: 100%;">
                  <ul id="ul_tabs">
                    
                  </ul>
                  
            </div>
        </div>
    </div>
    <!--</div>-->
    <div class='footer'>Produit par l'equipe SACRE, ADMIN SACRE-> PROD + autres xgld8274</div>
        
    <div id="load_parametres" ></div>
    <div id="dialog-confirm" ></div>
</body>

</html>



