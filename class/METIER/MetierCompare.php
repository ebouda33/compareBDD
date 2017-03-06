<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace METIER;

use Exception;
use METIER\Entity\DataComparaison;
use STANDARD\model\CompareModel;
use STANDARD\SQL\BDD;
use STANDARD\SQL\SQL;

/**
 * Description of MetierCompare
 *
 * @author xgld8274
 */
class MetierCompare {
    
    private $listeConnecteurs = array();
    private $execution = false;
    private $tableExec = "";
    private $sortieExec = array();
    private $msgErreur = "";
    
    //put your code here
    public function __construct($ini,array $params) {
        if(count($params) !== 2){
            throw new Exception('Pour comparer il faut 2 BDD!!!', 001);
        }
        
        foreach ($params as $param){
            array_push($this->listeConnecteurs,new BDD($ini,$param->env,$param->dbname));
        }
    }
    
    public function listeTable(){
        $echo = array();
        foreach ($this->listeConnecteurs as $bdd){
            $tables = $bdd->showTables();
            $echo[$bdd->getDbName()] = $tables;
        }
        
        return $echo;
    }
    
    public function getParameters($table){
        $echo = new MetierParametres();
        foreach ($this->listeConnecteurs as $bdd){
            $infos= $bdd->getInfos($table);
            $echo->add($infos);
        }
        
        return $echo;
    }
    
    public function execute(DataComparaison $data){
        //controler info
        $this->execution = false;
        $this->tableExec = $data->getTable();
        $base1 = $this->listeConnecteurs[0];
        $base2 = $this->listeConnecteurs[1];
        //si pas de case cocher sur primaire aberrant !!!
        if(count($data->getPrimary()) == 0){
            //chercher info
            $infos1 = $base1->getInfos($data->getTable());
            $infos2 = $base2->getInfos($data->getTable());
            
            //TODO comparer les colonnes de la 1 avec la 2
            $resultat = $this->comparaisonColonnes($infos1['primary'], $infos2['primary']);
            $data->setPrimary($resultat);
        }
        if(count($data->getElement()) == 0){
            //chercher info
            $infos1 = $base1->getInfos($data->getTable());
            $infos2 = $base2->getInfos($data->getTable());
            //TODO comparer les colonnes de la 1 avec la 2
            $elements = array();
            $resultat = $this->comparaisonColonnes(array_keys($infos1['metadata']), array_keys($infos2['metadata']));
            foreach($resultat as $value){
                array_push($elements, $value);
            }
            $data->setElement($elements);
            
        }
        
        $model = new CompareModel($base1);
        $listeRequete = $this->generateSQL($data,$base1,$base2);
        foreach($listeRequete as $titre => $requete){
            $total = 0;
            try{
                $resultat = $model->execute($requete);
                $total = SQL::executeQueryCount($base1, $requete);
                
                $this->execution = true;
                $this->msgErreur = '';
            }catch(Exception $exc){
//                echo $exc;
                $this->execution = false;
                $this->msgErreur = $exc;
            }
            
            
            if(is_array($resultat)  && count($resultat)>0){
                foreach ($resultat as &$row){
                   $row = $this->convertUTF8($row);
                }
                
            }
            
            
//            $this->sortieExec[$titre] = $requete;
            $this->sortieExec[$titre] = array($requete ,$resultat,$total);
            
        }
       
        return $this->execution ;
    }
    
    private function convertUTF8($row){
        if(is_array($row)){
            foreach ($row as $key=>$value){
                $key = iconv('UTF-8', 'UTF-8//IGNORE', utf8_encode($key));
                $row[$key] = iconv('UTF-8', 'UTF-8//IGNORE', utf8_encode($value));
            }
        }
        return $row;
    }
            
    
    function getResulat($table){
        $msg = "Aucune analyse n'a eu lieu";
        $stabs = array();
        if($this->execution){
            $msg = "Execution OK";
            foreach($this->sortieExec as $titre=>$resultat){
                $msg = "Execution OK";
                $total = $resultat[2];
                
                if($total == 0){
                    $msg = "Aucun Résultat<br>";   
                    $msg .= $resultat[0];
                }else{
                    $msg = $total." lignes trouvées.";    
                }
                $data = self::contruireHTMLResultat($resultat[1]);
                
                array_push($stabs, array(
                'data' => array('table'=>$titre."($total)",'requete'=>$resultat[0], 'data' => $data,'msg'=>  $msg),
                'activate'=> true
                    ));
                
            }
            
        }else{
            $msg = $this->msgErreur;
        }
        $tabs = array('stabs'=>$stabs,"msg"=>$msg);
        return $tabs;
    }
    
    
    private static function contruireHTMLResultat(array $rows){
        $echo = "";
        if(count($rows)>0){
            $echo = "<table border=1 widht=100% height=100%>";
            //entete
            $echo .= "<tr>";
            foreach($rows[0] as $key=>$value){
            $echo .= "<th>";
            $echo .= $key;
            $echo .= "</th>";
            }
            $echo .= "</tr>";
            
            foreach($rows as $row){
                $echo .= "<tr>";
               
                $values = array_values($row);
                for($i=0 ;$i < count($values)-1;$i+=2 ){
                    
                    $value1 = $values[$i];
                    $value2 = $values[$i+1];
                    $color = "";
                    if($value1 <> $value2){
                        $color = 'style=background-color:#FF0000;color:#FFF;';
                    }
                    $echo .= "<td $color>";
                    $echo .= $value1;
                    $echo .= "</td>";
                    
                    $echo .= "<td $color>";
                    $echo .= $value2;
                    $echo .= "</td>";
                    
                }
                
                $echo .= "<tr>";
            }
            
            
            $echo .= "</table>";
        }
        return $echo;
    }
    
    
    private function generateSQL(DataComparaison $data,BDD $base1,BDD $base2){
        //
        $liste = array();
        $dbName1 = $base1->getDbName();
        $dbName2 = $base2->getDbName();
        
        $liste["Lignes manquantes dans $dbName1.{$data->getTable()}(t2)"] = CompareModel::requeteManquant("t1",$data,$dbName1,$dbName2);
       
        $liste["Lignes manquantes dans $dbName2.{$data->getTable()}(t1)"] = CompareModel::requeteManquant("t2",$data,$dbName1,$dbName2);
        
        $liste["Requete Identique dans {$data->getTable()}"] = CompareModel::requeteIdentique($data,$dbName1,$dbName2);
        
        $liste["Requete Differente dans {$data->getTable()}"] = CompareModel::requeteDifferent($data,$dbName1,$dbName2);
        
        
        return $liste;
    }
    
    
    
    
    private function comparaisonColonnes(array $table1,array $table2){
        $tableauMax = $table1;
        $tableauMin = $table2;
        $resultat = array();
                
        if(count($table1) > count($table2)){
            $tableauMax = $table1;
            $tableauMin = $table2;
        }else{
            $tableauMax = $table2;
            $tableauMin = $table1;
        }
        
        foreach ($tableauMin as $value){
            if(in_array($value, $tableauMax)){
                array_push($resultat, $value);
            }
        }
        
        return $resultat;
    }
    
    
}
