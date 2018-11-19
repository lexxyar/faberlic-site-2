<?php
define('DS', DIRECTORY_SEPARATOR);

$sUri = str_replace('/server/','', $_SERVER['REQUEST_URI']);
$aUri = explode('/',$sUri);

if($aUri[0] === 'catalog'){
    $response = new stdClass();
    $response->meta = new stdClass();
    $dirPath = $_SERVER['DOCUMENT_ROOT'].DS.'dist'.DS.'images'.DS.'catalog'.DS;
    if(isset($aUri[1])){
        $catalogNum = is_numeric($aUri[1])?$aUri[1]:1;
        $catPath = $dirPath.$catalogNum.DS;
        $files = glob($catPath.'*.{jpg,png,gif}', GLOB_BRACE);
        $link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . '://'.$_SERVER['HTTP_HOST'];

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
//     else{
//         foreach (new DirectoryIterator($dirPath) as $fileInfo) {
//             if($fileInfo->isDot()) continue;
//             if(!$fileInfo->isDir()) continue;
//             // echo $fileInfo->getFilename() . "<br>\n";

//             $catPath .= $catalogNum.DS;
//             $files = glob($catPath.'*.{jpg,png,gif}', GLOB_BRACE);
//             $response->meta->count = sizeof($files);
//             foreach($files as $file) {
//                 $link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . '://'.$_SERVER['HTTP_HOST'];
//                 $response->data[] = $link.'/dist/images/catalog/'.$catalogNum.'/'.str_replace($catPath, '', $file);
//                 break;
//             }
//         }
// die();        
//     }
}

// var_dump($_SERVER['REQUEST_URI']);
// var_dump($_SERVER['HTTP_HOST']);
// var_dump($_SERVER['SERVER_NAME']);

http_response_code(404);
header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found", true, 404);
die();