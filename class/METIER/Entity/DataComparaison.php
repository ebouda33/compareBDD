<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace METIER\Entity;

/**
 * Description of DataComparaison
 *
 * @author xgld8274
 */
class DataComparaison {
    //put your code here
    
    private $table;
    private $element = array();
    private $primary = array();
    private $nullable = array();
    
    public function __construct(array $elt) {
        $this->setTable($elt['table']);
        if(isset($elt['primary'])){
            $this->setPrimary($elt['primary']);
        }
        if(isset($elt['elements'])){
            $this->setElement($elt['elements']);
        }
        if(isset($elt['nullable'])){
            $this->setNullable($elt['nullable']);
        }
    }

    function getTable() {
        return $this->table;
    }

    function getElement() {
        return $this->element;
    }

    function getPrimary() {
        return $this->primary;
    }

    function getNullable() {
        return $this->nullable;
    }
    
    function setTable($table) {
        $this->table = $table;
    }

    function setElement(array $element) {
        $this->element = $element;
    }

    function setPrimary(array $primary) {
        $this->primary = $primary;
    }

    function setNullable(array $nullable) {
        $this->nullable = $nullable;
    }



}
