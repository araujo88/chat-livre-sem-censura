<?php include("header.php") ?>

<div class="row d-flex justify-content-center w-100">
  <div class="col-4 mt-5 text-center">
    <h2>
      <label class="form-label text-white">Chat livre e sem censura</label>
    </h2>
    <div class="row mt-5">
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