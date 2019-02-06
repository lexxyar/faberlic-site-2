<?php
$config = new stdClass();
$config->password = md5('1q1q1q1q');
$config->session_lifetime = 60; // seconds

// session_set_cookie_params(60*1); //1 minute
session_set_cookie_params(0); // session valid while browser is opened
session_start();

define('PRODUCTION_MODE', false);
define('DS', DIRECTORY_SEPARATOR);
define('DIST_FOLDER', PRODUCTION_MODE?'':DS.'dist');
define('DIST_LINK', PRODUCTION_MODE?'':'/dist');
define('SITE_ROOT', $_SERVER['DOCUMENT_ROOT'].DIST_FOLDER);
define('SITE_ROOT_LINK', DIST_LINK);

$sUri = str_replace('/server/','', $_SERVER['REQUEST_URI']);
$aUri = explode('/',$sUri);
$link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') . '://'.$_SERVER['HTTP_HOST'];
$method = $_SERVER['REQUEST_METHOD'];

if($aUri[0] === 'check'){
    echo (isset($_SESSION['hash']) && $_SESSION['hash'] !== '');
    die();
}

// setcookie(session_name(), session_id(), time()+$config->session_lifetime);

if($aUri[0] === 'catalog'){
    $response = new stdClass();
    $response->meta = new stdClass();
    $dirPath = SITE_ROOT.DS.'images'.DS.'catalog'.DS;

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
                $response->data[] = $link.SITE_ROOT_LINK.'/images/catalog/'.$catalogNum.'/'.str_replace($catPath, '', $file);
            }
            header('Content-Type: application/json');
            echo json_encode($response);
            die();
        }
    }
}

if($aUri[0] === 'image'){
    if(isset($aUri[1]) && $aUri[1] !== ''){
        $imgCatalog = $aUri[1];
        $dirPath = SITE_ROOT.DS.'images'.DS.$imgCatalog.DS;
        if(isset($aUri[2]) && $aUri[2] !== ''){
            $imgNumWithHash = $aUri[2];

            $aVals = explode('?',$imgNumWithHash);
            $imgNum = $aVals[0];
            $hash = isset($aVals[1])?$aVals[1]:'';

            if($_SESSION['hash'] === $hash){
                $filePath = $dirPath.$imgCatalog.'_'.$imgNum.'.png';

                if(file_exists($filePath)){

                    $fp = fopen($filePath, 'rb');
                    header('Content-Type: '.mime_content_type($filePath));
                    header('Content-Length: ' . filesize($filePath));
                    fpassthru($fp);

                    die();
                }
            }
        }
    }
}

if($aUri[0] === 'study'){
    if(isset($aUri[1]) && $aUri[1] !== ''){
        $hash = $aUri[1];
        if($_SESSION['hash'] === $hash){
            $response = new stdClass();
            $response->meta = new stdClass();
            $dirPath = SITE_ROOT.DS.'images'.DS.'study'.DS;
            $files = glob($dirPath.'*.{jpg,png,gif}', GLOB_BRACE);
            $response->meta->count = sizeof($files);
            foreach($files as $file) {
                $filenum = explode('.',explode('_', str_replace($dirPath, '', $file))[1])[0];
                $response->data[] = $link.'/server/image/study/'.$filenum.'?'.$hash;
            }
            header('Content-Type: application/json');
            echo json_encode($response);
        }
        die();
    }
    // $filePath = SITE_ROOT.DS.'study.html';
    // $content = file_get_contents($filePath);
    // $doc = new DOMDocument();
    // $doc->loadHTML($content);
    // $body = $doc->getElementsByTagName('body')->item(0);
    
    // $response = base64_encode($doc->saveHtml($body));
    // echo json_encode($response);
    // die();
}

if($method === 'POST' && $aUri[0] === 'studycontent'){
    $sendedPassword = md5(isset($_POST['password'])?$_POST['password']:'');
    $response = new stdClass();
    $response->type = 'error';
    $response->value = '403';
    if($sendedPassword === $config->password){
        $hash = md5($config->password.'='.(new DateTime)->getTimestamp());
        if(isset($_SESSION['hash']) && $_SESSION['hash'] !== ''){
            $hash = $_SESSION['hash'];
        }
        
        $_SESSION['hash'] = $hash;
        $response->type = 'success';
        // $response->hash = $hash;
    $response->value = $hash;
    }else{

    }
    echo json_encode($response);
    die();
}

http_response_code(404);
header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found", true, 404);
die();