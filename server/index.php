<?php
$config = new stdClass();
$config->password = md5('1q1q1q1q');

define('DS', DIRECTORY_SEPARATOR);

$sUri = str_replace('/server/','', $_SERVER['REQUEST_URI']);
$aUri = explode('/',$sUri);
$link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . '://'.$_SERVER['HTTP_HOST'];

if($aUri[0] === 'catalog'){
    $response = new stdClass();
    $response->meta = new stdClass();
    $dirPath = $_SERVER['DOCUMENT_ROOT'].DS.'dist'.DS.'images'.DS.'catalog'.DS;

    if(isset($aUri[1])){
        $catalogNum = is_numeric($aUri[1])?$aUri[1]:1;
        $catPath = $dirPath.$catalogNum.DS;
        $files = glob($catPath.'*.{jpg,png,gif}', GLOB_BRACE);

        if(isset($aUri[2]) && $aUri[2] === 'title' && sizeof($files)>0){
            $fp = fopen($files[0], 'rb');
            header('Content-Type: '.mime_content_type($files[0]));
            header('Content-Length: ' . filesize($files[0]));
            fpassthru($fp);
            die();
        }else{
            $response->meta->catalog = $catalogNum;
            $response->meta->count = sizeof($files);
            foreach($files as $file) {
                $response->data[] = $link.'/dist/images/catalog/'.$catalogNum.'/'.str_replace($catPath, '', $file);
            }
            header('Content-Type: application/json');
            echo json_encode($response);
            die();
        }
    }
}

if($aUri[0] === 'slider'){
    $response = new stdClass();
    $response->meta = new stdClass();
    $dirPath = $_SERVER['DOCUMENT_ROOT'].DS.'dist'.DS.'images'.DS.'slider'.DS;
    $catPath = $dirPath;
    $files = glob($catPath.'*.{jpg,png,gif}', GLOB_BRACE);

    if(isset($aUri[1])){
        $slideNum = is_numeric($aUri[1])?$aUri[1]:0;
        $file = $files[$slideNum];
        $fp = fopen($file, 'rb');
        header('Content-Type: '.mime_content_type($file));
        header('Content-Length: ' . filesize($file));
        fpassthru($fp);
        die();
    } else {
        $response->meta->count = sizeof($files);
        foreach($files as $file) {
            $response->data[] = $link.'/dist/images/slider/'.str_replace($catPath, '', $file);
        }
        header('Content-Type: application/json');
        echo json_encode($response);
        die();
    }
}

http_response_code(404);
header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found", true, 404);
die();