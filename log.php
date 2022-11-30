<div id="chatbox"><?php
if(file_exists("log.html") && filesize("log.html") > 0){
     
    $contents = file_get_contents("log.html");         
    echo $contents;
}
?></div>