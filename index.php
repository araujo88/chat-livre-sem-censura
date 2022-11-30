<?php
 
session_start();
 
if(isset($_GET['logout'])){    
     
    //Simple exit message
    $logout_message = "<div class='msgln'><span class='chat-time'>".date("g:i A")."</span><span class='left-info'> <b class='user-name-left'>". $_SESSION['name'] ."</b> saiu.</span><br></div>";
    file_put_contents("log.html", $logout_message, FILE_APPEND | LOCK_EX);
     
    session_destroy();
    header("Location: index.php"); //Redirect the user
}
 
if(isset($_POST['enter'])){
    if(strlen($_POST['name']) > 16){
        echo '<script>alert("O nome não pode exceder 16 caracteres!")</script>';
        header("Refresh:0");
    }
    else if($_POST['name'] != ""){
        $_SESSION['name'] = stripslashes(htmlspecialchars($_POST['name']));
    }
    else{
        echo '<script>alert("O nome não pode ficar em branco!")</script>';
        header("Refresh:0");
    }
}
 
function loginForm(){
    echo
    '<div id="loginform">
    <p>Digite um nome:</p>
    <form action="index.php" method="post">
      <input type="text" name="name" id="name" />
      <input type="submit" name="enter" id="enter" value="Entrar" />
    </form>
  </div>';
}
 
?>
 
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
 
        <title>Chat livre e sem censura</title>
        <meta name="description" content="Chat livre e sem censura" />
        <link rel="stylesheet" href="style.css" />
    </head>
    <body>
    <?php
    if(!isset($_SESSION['name'])){
        loginForm();
    }
    else {
        if(!isset($_GET['logout'])) {
            $message = "<div class='msgln'><span class='chat-time'>".date("g:i A")."</span><span class='left-info'> <b class='user-name-left'>". $_SESSION['name'] ."</b> entrou.</span><br></div>";
            file_put_contents("log.html", $message, FILE_APPEND | LOCK_EX);
        }
    ?>
        <div id="aspectwrapper">
            <div id="content">
                <div id="wrapper">
                    <div id="menu">
                        <p class="welcome">Olá, <?php echo $_SESSION['name']; ?>!</p>
                        <p class="logout"><a id="exit" href="#">Sair</a></p>
                    </div>
        
                    <div id="chatbox">
                    <?php
                    if(file_exists("log.html") && filesize("log.html") > 0){
                        $contents = file_get_contents("log.html");          
                        echo $contents;
                    }
                    ?>
                    </div>
        
                    <form name="message" action="">
                        <input name="usermsg" type="text" id="usermsg" />
                        <input name="submitmsg" type="submit" id="submitmsg" value="Enviar" />
                    </form>
                </div>
            </div>
        </div>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <script type="text/javascript">
            // jQuery Document
            $(document).ready(function () {
                $("#submitmsg").click(function () {
                    var clientmsg = $("#usermsg").val();
                    $.post("post.php", { text: clientmsg });
                    $("#usermsg").val("");
                    return false;
                });
 
                function loadLog() {
                    var oldscrollHeight = $("#chatbox")[0].scrollHeight - 20; //Scroll height before the request
 
                    $.ajax({
                        url: "log.html",
                        cache: false,
                        success: function (html) {
                            $("#chatbox").html(html); //Insert chat log into the #chatbox div
 
                            //Auto-scroll           
                            var newscrollHeight = $("#chatbox")[0].scrollHeight - 20; //Scroll height after the request
                            if(newscrollHeight > oldscrollHeight){
                                $("#chatbox").animate({ scrollTop: newscrollHeight }, 'normal'); //Autoscroll to bottom of div
                            }   
                        }
                    });
                }
 
                setInterval (loadLog, 500);
 
                $("#exit").click(function () {
                    var exit = confirm("Você tem certeza que deseja sair?");
                    if (exit == true) {
                    window.location = "index.php?logout=true";
                    }
                });
            });
        </script>
    </body>
</html>
<?php
}
?>