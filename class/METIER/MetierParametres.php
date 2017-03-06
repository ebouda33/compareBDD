<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace METIER;

/**
 * Description of MetierParametres
 *
 * @author xgld8274
 */
class MetierParametres {
    //put your code here
    private $liste;
    
    public function __construct() {
        $this->liste = array();
    }

    
    public function add(array $params){
        
        array_push($this->liste, $params);
    }
    
    
    public function get($index=null){
        $param = null;
        if(is_null($index)){
            $param = array_shift($this->liste);
        }else{
            if($index >=0 && $index < count($this->liste)){
                $param = $this->liste[$index];
            }else{
                throw new Exception("index out of bounds for parameters from ".get_class(), 999);
            
            }
        }
        
        return $param;
    }
    
}
