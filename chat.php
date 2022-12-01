<?php 
if(!isset($_SESSION)) session_start();
?>
<?php include("header.php") ?>

<!-- Session ID !-->
<input id="username" type="hidden" value="<?= $_SESSION['name'] ?>">

<!-- Side menu -->
<div id="menu" class="d-flex flex-column flex-shrink-0 text-white bg-dark hide-nav-menu">
    <div class="generic-menu-wrapper">
        <div class="generic-wrapper border-bottom border-white p-3 text-center">
            <span class="fs-4">Menu</span>
        </div>
        <div class="d-flex flex-column mt-3 h-100">
            <div class="mt-3">
                <button id="chat-link-nav-anchor" tabindex="-1" class="w-100 btn btn-primary">Chat</button>
            </div>
            <div class="mt-3">
                <button id="logout-link-nav-anchor" tabindex="-1" class="w-100 btn btn-danger">Logout</button>
            </div>
            <span class="mt-auto text-center text-white">Bem-vindo <?= $_SESSION['name'] ?></span>
        </div>
    </div>
</div>

<!-- Container chatbox -->
<div class="right-side w-100 h-100">
    <div class="generic-wrapper p-4 h-100 w-100 d-flex">
        <div class="chat-container w-100 h-100 d-flex flex-column">
            <div class="chat-title d-flex justify-content-center">
                <!-- Button open menu -->
                <div id="wrapper-btn-menu">
                    <button id="btn-menu" tabindex="1" class="btn-menu btn">
                        <span class="fa fa-bars"></span>
                    </button>
                </div>

                <div class="wrapper-chat-title">
                    <span>Chat room</span>
                </div>
            </div>            
            <div id="chat-box" tabindex="4" class="d-flex flex-column h-100 text-white">               
            </div>
            <div id="scroll-link-nav-anchor" tabindex="6" class="scroll-to-bottom-wrapper" title="Ir para as últimas mensagens" aria-label="Ir para as últimas mensagens">
                <i class="fa fa-arrow-down"></i>
            </div>
            <div class="chat-message-input d-flex mt-3">
                <input type="text" class="form-control" tabindex="5" placeholder="Enter para enviar" id="send-message-btn">
            </div>
        </div>
    </div>
</div>

<!-- Scripts -->
<script src="../public/js/common.js"></script>
<script src="../public/js/chat.js"></script>

<?php include("footer.php") ?>