<?php include("header.php") ?>

<!-- Login page -->
<div class="d-flex justify-content-center w-100">
  <div class="container-fluid wrapper-login-form mt-5 text-center">
    <label class="form-label text-white">Chat livre e sem censura</label>
    <div class="row mt-3">
      <form id="login-form" novalidate>
        <input class="form-control" type="text" name="name" id="name" placeholder="Digite um nome" aria-label="Digite um nome" />
        <button class="btn btn-primary form-control mt-3 w-50" type="submit" name="enter">Entrar</button>
      </form>
    </div>
  </div>
</div>

<script src="../public/js/common.js"></script>
<script src="../public/js/login.js"></script>

<?php include("footer.php") ?>