<?php 
if(!isset($_SESSION)) session_start();
?>
<?php include("header.php") ?>

<!-- Session ID !-->
<input id="username" type="hidden" value="<?= $_SESSION['name'] ?>">

<div class="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style="width: 280px;">
    <div class="generic-wrapper border-bottom border-white p-3">
        <a href="#" class="d-flex justify-content-center align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none w-100">
            <span class="fs-4">Menu</span>
        </a>
    </div>
    <div class="d-flex flex-column mt-3 h-100">
        <div class="mt-3">
            <button id="chat-link-nav-anchor" class="w-100 btn btn-primary">Chat</button>
        </div>
        <div class="mt-3">
            <button id="logout-link-nav-anchor" class="w-100 btn btn-danger">Logout</button>
        </div>
        <div class="mt-3">
            <button id="scroll-link-nav-anchor" class="w-100 btn btn-success">Scroll Bottom</button>
        </div>
        <span class="mt-auto text-center text-white">Bem-vindo <?= $_SESSION['name'] ?></span>
    </div>
</div>

<div class="right-side w-100 h-100">
    <div class="generic-wrapper p-5 h-100 d-flex">
        <div class="chat-container w-100 h-100 d-flex flex-column">
            <div class="chat-title d-flex justify-content-center">
                <h2 class="text-white">Chat room</h2>
            </div>
            <div id="chat-box" tabindex="0" class="d-flex flex-column h-100 text-white">
            </div>
            <div class="chat-message-input">
                <input type="text" class="form-control" placeholder="Enter para enviar" id="send-message-btn">
            </div>
        </div>
    </div>
</div>

<!-- Scripts -->
<script src="../public/js/common.js"></script>
<script src="../public/js/chat.js"></script>

<?php include("footer.php") ?>