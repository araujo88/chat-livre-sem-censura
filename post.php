<?php
session_start();
if(isset($_SESSION['name'])){
    $text = $_POST['text'];
     
    $text_message = "<div class='msgln'><span class='chat-time'>".date("g:i A")."</span> <b class='user-name'>".$_SESSION['name']."</b> ".stripslashes(htmlspecialchars($text))."<br></div>";
    if (strlen($text_message) > 256) {
        $text_message = "<div class='msgln'><span class='chat-time'>".date("g:i A")."</span> <b class='user-name'>".$_SESSION['name']."</b> ".stripslashes(htmlspecialchars("Mensagem excedeu limite de 256 caracteres."))."<br></div>";
        file_put_contents("log.html", $text_message, FILE_APPEND | LOCK_EX);
    }
    else {
        file_put_contents("log.html", $text_message, FILE_APPEND | LOCK_EX);
    }
}
?>