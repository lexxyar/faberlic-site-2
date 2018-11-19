<?php
define('DS', DIRECTORY_SEPARATOR);

$sUri = str_replace('/server/','', $_SERVER['REQUEST_URI']);
$aUri = explode('/',$sUri);
// var_dump($aUri);

if($aUri[0] === 'catalog'){
    $response = new stdClass();
    $response->meta = new stdClass();
    $catalogNum = isset($aUri[1])?(is_numeric($aUri[1])?$aUri[1]:1):1;
    $response->meta->catalog = $catalogNum;
    $dirPath = $_SERVER['DOCUMENT_ROOT'].DS.'dist'.DS.'images'.DS.'catalog'.DS.$catalogNum.DS;
    $files = glob($dirPath.'*.{jpg,png,gif}', GLOB_BRACE);
    $response->meta->count = sizeof($files);
    // $response->pages = [];
    foreach($files as $file) {
        $link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . '://'.$_SERVER['HTTP_HOST'];
        $response->data[] = $link.'/dist/images/catalog/'.$catalogNum.'/'.str_replace($dirPath, '', $file);
    }
    


    header('Content-Type: application/json');
    echo json_encode($response);
    die();
}

// var_dump($_SERVER['REQUEST_URI']);
// var_dump($_SERVER['HTTP_HOST']);
// var_dump($_SERVER['SERVER_NAME']);
