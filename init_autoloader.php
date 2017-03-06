<?php


chdir(dirname(__FILE__));
if (file_exists('class/AutoLoader.php')) {
    $loader = require_once 'class/AutoLoader.php';
}


//definition des namespaces 
$config = array("ns"=>array(
                "METIER"=>dirname(__FILE__).DIRECTORY_SEPARATOR."class".DIRECTORY_SEPARATOR,
                "STANDARD"=>dirname(__FILE__).DIRECTORY_SEPARATOR."class".DIRECTORY_SEPARATOR,
               
    
));
Autoloader::register($config);

