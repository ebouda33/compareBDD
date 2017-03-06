<?php
set_time_limit(60*60*3);
use STANDARD\SQL\BDD;
use STANDARD\Fichier\Explorer;
use STANDARD\Fichier\Fichier;
use STANDARD\ReaderIni;
 require_once './init_autoloader.php';
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

session_start();
 
$menu = array();
$menu[] = '';
$menu[1] = 'test_prod';
$menu[2] = 'file';
$menu[3] = 'file_local';
$menu[4] = 'file_delete';
$menu[5] = 'files_sql_log';
$menu[6] = 'files_sql_save';
$menu[7] = 'get_bdd_sql_compare';
$menu[8] = 'refresh_log';
$menu[9] = 'getParametersSQL';
$menu[10] = 'compare';



$demande = filter_input(INPUT_POST, 'demande');


$path = dirname(__FILE__).DIRECTORY_SEPARATOR."config";

$pathFiles = dirname(__FILE__).DIRECTORY_SEPARATOR."CFT";
$demandeOrigine = $demande;
if($demande == 'file_local_sql' || $demande == 'file_local_sql_save'){
    $demande = 'file_local';
    $pathFiles = dirname(__FILE__).DIRECTORY_SEPARATOR."SQL";
}

$ini = ReaderIni::read($path.DIRECTORY_SEPARATOR. 'config_file_cft.conf');

if($demande == $menu[1]){
    
    $conn = null;
    $json = array();
    try{
        $conn = new CnxSFTPProd($ini);
        
        $json = $conn->getCFTFILES();
        $json['success'] = true;
        
        
        
        
    }catch(Exception $e){
        $json['success'] = false;
        
        $json['msgErreur'] = $e->getMessage();
        
        
    }
    
    
}else if($demande == $menu[2]){
    $data = $_POST['data'];
    try{
        $params = ParamsTransfert::makeListeParams($data);
        $etat = TransertFiles::getFiles($ini, $params);
        if($etat === false){
            $json['msgErreur'] = TransertFiles::getLog();
        }
        $json['success'] = $etat;
        $json['file'] = array();
        foreach($params as $param){
            array_push($json['file'],$param->getFileName());
        }
        
    }catch(Exception $e){
        $json['success'] = false;
        
        $json['msgErreur'] = $e->getMessage();
        
        
    }
    
}elseif($demande == $menu[3]){
    $explorer = new Explorer($pathFiles);
    
    $json['files'] = $explorer->toArray();
    
    $json['success'] = !$explorer->getError();
        
    $json['msgErreur'] = $explorer->getMessageError();
    
    $json['demande'] = $demandeOrigine;
}else if($demande == $menu[4]){
    $data = $_POST['data'];
    $path = dirname(__FILE__).DIRECTORY_SEPARATOR.'CFT'.DIRECTORY_SEPARATOR;
    $success = true;
    $file = "";
    foreach($data as $filename){
        if(!file_exists($path.$filename)){
            $path = dirname(__FILE__).DIRECTORY_SEPARATOR.'SQL'.DIRECTORY_SEPARATOR;
        }
        $success = Fichier::_effaceFichier($path.$filename) && $success;
        $file += $filename .",";
    }
    $json = array("success"=>$success);
    $json['msgErreur'] = $file;
}else if($demande == $menu[5]){
    try{
        $bdd = new CnxSFTPProdBDD($ini);
        $liste = $bdd->getSQLLogFiles();
        $json = array("success"=>true,"files"=>$liste);
        $json['type'] = $demande;
     }catch(Exception $e){
        $json['success'] = false;
        
        $json['msgErreur'] = $e->getMessage();
        
        
    }
}else if($demande == $menu[6]){
    try{
        $bdd = new CnxSFTPProdBDD($ini);
        $liste = $bdd->getSQLSaveFiles();
        $json = array("success"=>true,"files"=>$liste);
        $json['type'] = $demande;
     }catch(Exception $e){
        $json['success'] = false;
        
        $json['msgErreur'] = $e->getMessage();
        
        
    }
}else if($demande == $menu[7]){
    try{
        $pliste = filter_input(INPUT_POST, 'liste');
        
        $json = array("success"=>true,"bdd"=>$pliste);
        $json['type'] = $demande;
        if(!empty($pliste) && $pliste === 'true'){
            $liste = BDD::listeBDD($ini);
            $json['success'] = true;
            $json['bdd'] = $liste;
        }else{
            $data = $_POST['data'];
            $params = array();
            foreach ($data as $env){
                array_push($params, json_decode($env));
            }
            $metier = new \METIER\MetierCompare($ini, $params);
            $_SESSION['PARAM_SQL'] = $params;
//            $json['bdd'] = $metier->listeTable();
            $json['vue'] =  METIER\MetierCompareVue::affichageTable($metier);
            $json['success'] = true;
        }

        $json['liste'] = $pliste;
     }catch(Exception $e){
        $json['success'] = false;
        
        $json['msgErreur'] = $e->getMessage();
        
        
    }
}else if ($demande == $menu[8]){
    //lire fichier log
    $path = dirname(__FILE__).DIRECTORY_SEPARATOR."log";
    $explorer = new Explorer($path,"log");
    $obj = $explorer->toArray();
//    var_dump($obj)        ;
    $file = $obj[count($obj)-1]['name'];
    $fichier = new Fichier($path,$file);
    $contenu = $fichier->lireFichierEntier();
    $contenu = str_replace("\n", "<br/>",$contenu);
    echo $contenu;
//    echo 'HTML <b> Coucouc</b>';
    
}else if ($demande == $menu[9]){
    try{
        $pliste = filter_input(INPUT_POST, 'liste');
        
        $json = array("success"=>true,"bdd"=>$pliste);
        $json['type'] = $demande;
        if(!empty($pliste) && $pliste === 'true'){
            $liste = BDD::listeBDD($ini);
            $json['success'] = true;
            $json['bdd'] = $liste;
        }else{
            if(isset($_SESSION['PARAM_SQL'])){
                $params = $_SESSION['PARAM_SQL'];
            }
            $table = filter_input(INPUT_POST, 'table');
            $metier = new \METIER\MetierCompare($ini, $params);
            
            $json['vue'] = METIER\MetierCompareVue::affichageParametres($metier->getParameters($table));
            
            $json['success'] = true;
        }

        $json['liste'] = $pliste;
     }catch(Exception $e){
        $json['success'] = false;
        
        $json['msgErreur'] = $e->getMessage();
        
        
    }
}else if ($demande == $menu[10]){
    $json = array("success"=>true,"msg"=>"","msgErreur"=>"");
    
    try{
        if(isset($_SESSION['PARAM_SQL'])){
            $params = $_SESSION['PARAM_SQL'];
        }
        
        $data = new METIER\Entity\DataComparaison($_POST['elt']);
        
        $json['table'] = $data->getTable();
        $metier = new \METIER\MetierCompare($ini, $params);
        $json['success'] = $metier->execute($data);
        $json["stabs"] = $metier->getResulat($data->getTable())['stabs'];
        $json["msg"] = $metier->getResulat($data->getTable())['msg'];
    }catch(Exception $exc){
        $json['success'] = false;
        
        $json['msgErreur'] = $e->getMessage();
    }
    
}else{

    $json = array("success"=>false,"msgErreur"=>"Action inconnu");
}

if(!empty($json)){
    
    echo json_encode($json);
}