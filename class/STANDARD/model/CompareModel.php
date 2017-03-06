<?php
namespace STANDARD\model;

use Exception;
use METIER\Entity\DataComparaison;
use STANDARD\SQL\Model;
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of CompareModel
 *
 * @author xgld8274
 */
class CompareModel extends Model{
    //put your code here
    
    public static function requeteDifferent(DataComparaison $data,$dbName1,$dbName2){
        $requete = "select ";
        $where = " where ";
        foreach($data->getElement() as $col){
            $requete .= " t1.$col as 't1.$col',t2.$col as 't2.$col',";
            $where .= " ifnull(t1.$col,0) <> ifnull(t2.$col,0) or ";
        }
        $requete = substr($requete, 0,-1);
        $where = substr($where, 0,-3);
        $requete .= " from $dbName1.{$data->getTable()} t1 "
        . "inner join $dbName2.{$data->getTable()} t2 ";
        $requete .= " on ";
        foreach($data->getPrimary() as $primary){
            $requete .= " t1.$primary = t2.$primary and ";
        }
        $requete = substr($requete,0, -4);
        
        $requete .= $where;

        $requete .= " limit 0,1000";
        
        return $requete;
    }
    
    public static function requeteIdentique(DataComparaison $data,$dbName1,$dbName2){
        $requete = "select ";
        $where = " where ";
        foreach($data->getElement() as $col){
            $requete .= " t1.$col as 't1.$col',t2.$col as 't2.$col',";
            $where .= " ifnull(t1.$col,0) = ifnull(t2.$col,0) and ";
        }
        $requete = substr($requete, 0,-1);
        $where = substr($where, 0,-4);
        $requete .= " from $dbName1.{$data->getTable()} t1 "
        . "inner join $dbName2.{$data->getTable()} t2 ";
        $requete .= " on ";
        foreach($data->getPrimary() as $primary){
            $requete .= " t1.$primary = t2.$primary and ";
        }
        $requete = substr($requete,0, -4);
        
        $requete .= $where;
        
        $requete .= " limit 0,1000";
        
        return $requete;
    }
    
    public static function requeteManquant($tableManquante,DataComparaison $data,$dbName1,$dbName2){
        $table = '';
        $join = '';
        if($tableManquante === "t1"){
            $table = 't2';
            $join = 'left';
        }else if($tableManquante === "t2"){
            $table = 't1';
            $join = 'right';
        }else{
            throw new Exception("parametre incorrect", 0);
        }
        $requeteManque = "select ";
                foreach($data->getElement() as $col){
            $requeteManque .= " t1.$col as 't1.$col',t2.$col as 't2.$col' ,";
            
        }
        $requeteManque = substr($requeteManque, 0,-1);
        $requeteManque .= "from $dbName1.{$data->getTable()} t1 "
        . " $join join $dbName2.{$data->getTable()} t2 ";
        $requeteManque .= " on ";
        foreach($data->getPrimary() as $primary){
            if(in_array($primary,$data->getNullable() )){
                $requeteManque .= "(t1.$primary = t2.$primary or (t1.$primary is null and  t2.$primary is null))";
            }else{
                $requeteManque .= " t1.$primary = t2.$primary";
            }
            $requeteManque .= " and ";
        }
        $requeteManque = substr($requeteManque,0, -4);
        
        $requeteManque .=  " where ";
        foreach($data->getPrimary() as $primary){
            $requeteManque .= " $table.$primary is null and ";
        }
        $requeteManque = substr($requeteManque,0, -4);
        
        $requeteManque .= " limit 0,1000";
        return $requeteManque.";";
    }
}
