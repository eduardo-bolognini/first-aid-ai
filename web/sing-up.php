<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Sing Up</title>
    <link rel="stylesheet" href="static/style.css">
  </head>
    <?php 
      $id = $_GET['id'];
      if ($id) {
    ?>
      <body id="body-login">
          <div class="login">
            <div class="login-content">
              <h2>Sing Up</h2>
              <p class="error" id="error"></p>
              <input type="email" id="email" required placeholder="email" style="margin-bottom: 10px;">
              <input type="password" id="password" required placeholder="password" style="margin-bottom: 10px;">
              <input type="password" id="re-password" required placeholder="ripeti la password">
              <a href="login.html">Login</a>
              <button type="submit" onclick="window.validInviteLink('<?php echo $id ?>', func = function(){}); singup()" class="login-buttons login-button">Sing Up</button>
              <button id="google-signup-button" class="login-buttons" onclick="window.validInviteLink('<?php echo $id ?>', func = function(){});google()"><img src="static/google_logo.png">Sing up with Google</button>
              <button id="github-signup-button" class="login-buttons" onclick="window.validInviteLink('<?php echo $id ?>', func = function(){});github()"><img src="static/github_logo.png">Sing up with GitHub</button>
            </div>
          </div>
      <script src="https://www.gstatic.com/firebasejs/7.14.2/firebase-app.js"></script>
      <script src="https://www.gstatic.com/firebasejs/7.14.2/firebase-auth.js"></script>
      <script src="static/auth.js"></script>
      <script src="static/database.js" type="module"></script>
      <script>
        window.onload = function () {
          window.validInviteLink("<?php echo $id ?>", func = function(){})
        }
      </script>
      <script>
          document.addEventListener("keydown", function(event) {
              if (event.key === "Enter") {
                  singup()
              }
          });
          is_login(function() {location.href = "/chat.html"}, red = false)
        </script>
      </body>
    <?php } else {?>
      <body id="body-login">
        <div class="login">
            <form class="login-content" action="sing-up.php">
              <h2>Codice di invito</h2>
              <p class="error" id="error"></p>
              <input name="id" type="text" required placeholder="codice" style="margin-bottom: 10px;">
              <a href="login.html">Login</a>
              <button type="submit" class="login-buttons login-button">Continua</button>
            </form>
          </div>
          <script src="https://www.gstatic.com/firebasejs/7.14.2/firebase-app.js"></script>
          <script src="https://www.gstatic.com/firebasejs/7.14.2/firebase-auth.js"></script>
          <script src="static/auth.js"></script>
          <script>is_login(function() {location.href = "/chat.html"}, red = false)</script>
        </body>
    <?php } ?>
</html>