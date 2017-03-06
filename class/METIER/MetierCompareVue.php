<?php
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace METIER;

use Exception;

/**
 * Description of MetierCompareVue
 *
 * @author xgld8274
 */
class MetierCompareVue {
    //put your code here
    const HEADER = 1;
    const FOOTER = 2;
    const PARAMETER = 3;
            
    
    
    
    
    static private function writreLineTable($i,$param1,$param2,$etat=0,$jsObject='compare'){
        $css = 'rowImpaire';
        if($i%2 == 0)
            $css = 'rowPaire';
        
        $checkbox = "<input type='checkbox' id='$param1' onclick='".$jsObject.".selectTable();'>";
        $parametre = "<a href='javascript:".$jsObject.".getParametersSQL(\"$param1\");' >Parametres</a>";
        if(empty($param1) || empty($param2) || $param1 === "&nbsp;"||$param2 === "&nbsp;" ){
            $checkbox = $parametre = "";
        }
        if($etat === self::HEADER){
            return self::writreLineTableHeader($param1,$param2);
        }else if($etat === self::FOOTER){
            return self::writreLineTableFooter($param1,$param2);
        }
        return "<tr class='$css'><td>$checkbox</td><td>$param1</td><td>$param2</td><td>$parametre</td></tr>";
        
    }
    
    static private function writeLineTableParametre($param1,$param2,$primary = false,$null=false,$etat=0){
        $checkbox = "<input type='checkbox' id='parametres' name='parametres' value='$param1' checked>";
        $parametre = "<input type='checkbox' id='primary' name='primary' value='$param1'";
        $nullable = "<input type='checkbox' id='nullable' name='nullable' value='$param1'";
        if($primary){
            $parametre .=" checked";
        }
        if($null){
            $nullable .=" checked";
        }
        $parametre .=" >";
        $nullable .=" >";
        
        if(empty($param1) || empty($param2) || $param1 === "&nbsp;"||$param2 === "&nbsp;" ){
            $checkbox = $parametre = "";
        }
        if($etat === self::HEADER){
            return self::writreLineTableHeaderParameter($param1,$param2);
        }else if($etat === self::FOOTER){
            return self::writreLineTableFooterParameter($param1,$param2);
        }
        return "<tr><td>$checkbox</td><td>$param1</td><td>$param2</td><td>$parametre</td><td>$nullable</td></tr>";
        
    }
    
    static private function writreLineTableHeader($param1,$param2){
        
        return "<tr><th></th><th class='table'>$param1</th><th class='table'>$param2</th><th></th><th></th></tr>";
    }
    
    static private function writreLineTableFooter($param1,$param2){
        
        return "<tr><td></td><td>$param1</td><td>$param2</td><td></td><td></td></tr>";
    }
    
    
    static private function writreLineTableHeaderParameter($param1,$param2){
        
        return "<tr><th>Comparaison</th><th class='table'>$param1</th><th class='table'>$param2</th><th>Primary</th><th>Nullable</th></tr>";
    }
    
    static private function writreLineTableFooterParameter($param1,$param2){
        
        return "<tr><td></td><td>$param1</td><td>$param2</td><td></td><td></td></tr>";
    }
    
    static function affichageTable(MetierCompare $metier){
        $tables = $metier->listeTable();
        $dbnames = array();
        $db = array();
        
        foreach($tables as $dbName=>$table){
            $dbnames[] = $dbName;
            $db[] = $table;
        }
        
        $echo = "<table >";
        
        $echo .= self::writreLineTable(0,$dbnames[0], $dbnames[1],self::HEADER);
        $echo .= self::writreLineTable(0,"TABLES", "TABLES",self::HEADER);
        
        for ($i=0;$i<count($db[0]);$i++){
            $table1 = $db[0][$i];
            $table2 = isset($db[1][$i])?$db[1][$i]:null;
            $ligne1 = "";
            $ligne2 = "";
//            var_dump("db1_".$table1,"db2_".$table2);
            
            //on a trouve les memes tables on l affichera quoi qu il arrive
            if(array_search($table1, $db[1])!== false){
                $ligne1 .= self::writreLineTable($i,$table1, $table1);
            }else{
                $ligne1 .= self::writreLineTable($i,$table1,"&nbsp;");
            }
            //cependant on pas les memes index
            if(array_search($table2, $db[0])=== false){
                
                //on a pas trouve dans l autre db
                if(strcmp($table1, $table2)>0){
                    $ligne2 = $ligne1;
                    if(!is_null($table2)){
                        $ligne1 = self::writreLineTable($i,"&nbsp;", $table2);
                    }
                    $ligne1 .= $ligne2;
                }else{
                     if(!is_null($table2)){
                        $ligne1 = self::writreLineTable($i,"&nbsp;", $table2);
                    }
                }

           }
           $echo .= $ligne1;

        }
        
        $echo .= self::writreLineTable(0,"&nbsp;", "&nbsp;",self::FOOTER);
        $echo .= "</table>";
        
        
        return $echo;
    }
    
    static function affichageParametres(MetierParametres $params){
        $echo = "";
        //recuperer les infos des tables
        
        $echo .= "<form id='form_parametres'>";
        $echo .= "<input type='hidden' id='table' name='table' value='".$params->get(0)['name']."' />";
        $echo .= "<table border =0 >";
        
        $echo .= self::writreLineTableHeader($params->get(0)['schema'], $params->get(1)['schema'],self::HEADER);
        
        if($params->get(0)['name'] !== $params->get(1)['name']){
            
            throw new Exception('Table differente '.$params->get(0)['name'] .' '.$params->get(1)['name'].'.');
        }
        $echo .= self::writeLineTableParametre($params->get(0)['name'], $params->get(1)['name'],false,false,self::HEADER);
        
        $cols1 = $params->get(0)['cols'];
        $cols2 = $params->get(1)['cols'];
        
        $cols = $cols1;
        if(count($cols1) > count($cols2)){
               $cols = $cols2 ;
//            throw new Exception('le nombre de colonne de la table '.$params->get(0)['name'] .'n est pas identique.');
        }
        $primary = $params->get(0)['primary'];
        $nullable = array();
        if(isset($params->get(0)['nullable'])){
            $nullable = $params->get(0)['nullable'];
        }
        
        foreach($cols as $col){
//            var_dump($col);
            $primaire = false;
            $null = false;
            if(in_array($col->getName(), $primary)){
                $primaire = true;    
            }
            if(in_array($col->getName(), $nullable)){
                $null = true;    
            }
            $echo .= self::writeLineTableParametre($col->getName(), $col->getName(),$primaire,$null);
        }
        
        
        $echo .= "</table>";
        $echo .= "</form>";
        return $echo;
    }
    
}
