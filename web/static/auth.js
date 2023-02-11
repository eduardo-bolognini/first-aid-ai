const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: "",
    databaseURL: ""
};


firebase.initializeApp(firebaseConfig);

// Get the form element

// Add an event listener to the form's submit event
function singup() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var re_password = document.getElementById("re-password").value;
    if (email == "") {
        document.getElementById("error").innerHTML = "Inserisci la email"
    } else if (password == "") {
        document.getElementById("error").innerHTML = "Inserisci la password"
    } else if (password != re_password) {
        document.getElementById("error").innerHTML = "Le password non corrispondono"
    } else {

  // Create a new user with the name, email, and password
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function(user) {
        var uid = firebase.auth().currentUser.uid;
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
          fetch("/key/create?key="+uid, requestOptions)
            .then(response => response.text())
            .then(result => {
                var actionCodeSettings = {
                    url: 'http://localhost:8888/sito/login.html',
                };
            
                firebase.auth().currentUser.sendEmailVerification(actionCodeSettings)
                .then(function() {
                    location.href = "info.html?frase=ti abbiamo mandato una email di conferma"

                })
                .catch(function(error) {
                    console.error(error)
                });
            }).catch(error => console.log('error', error));
    }).catch(function(error) {
        // An error occurred, display an alert with the error message
        alert(error.message);
    });
    }}
function google() {
// Sign up the user with Google
var provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().signInWithPopup(provider)
  .then(function(result) {
    var uid = firebase.auth().currentUser.uid;
    if (result.additionalUserInfo.isNewUser) {
        location.href = "sing-up.php"
    } else {
        localStorage.setItem("key", uid)
        location.href="redirect.html"
        localStorage.setItem("login", true)
    }
  })
  .catch(function(error) {
    // An error occurred, display an alert with the error message
    alert(error.message);
  });
};

// Add an event listener to the button's click event
function github() {
// Sign up the user with GitHub
var provider = new firebase.auth.GithubAuthProvider();
firebase.auth().signInWithPopup(provider)
    .then(function(result) {
        var uid = firebase.auth().currentUser.uid;
        if (result.additionalUserInfo.isNewUser) {
            location.href = "sing-up.php"
        } else {
            location.href="/redirect.html"
            localStorage.setItem("key", uid)
            localStorage.setItem("login", true)
        }
    })
    .catch(function(error) {
        document.getElementById("error").innerHTML = error
    });
};

// Add an event listener to the form's submit event
function login() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
      if (email == "") {
          document.getElementById("error").innerHTML = "Inserisci la email"
      } else if (password == "") {
          document.getElementById("error").innerHTML = "Inserisci la password"
      } else {
// Sign in the user with email and password
firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(user) {
        var user = firebase.auth().currentUser
        var uid = user.uid;
        if (user.emailVerified == false) {
            document.getElementById("error").innerHTML = "Devi prima verificare l'email!"
        } else {
            localStorage.setItem("key", uid)
            location.href="/redirect.html"
            localStorage.setItem("login", true)
        }
    })
    .catch(function(error) {
        document.getElementById("error").innerHTML = error
    });
}};

function reimposta_password() {
var auth = firebase.auth();
  var email = document.getElementById("email").value;
  if (email == "") {
    document.getElementById("error").innerHTML = "Inserisci la email"
  }
  // Invia la richiesta di reimpostazione password a Firebase
  auth.sendPasswordResetEmail(email).then(function() {
    location.href = "/info.html?frase=ti abbiamo mandato una email per cambiare la password"
}).catch(function(error) {
    document.getElementById("error").innerHTML = error
});
}

function logout() {
    var auth = firebase.auth();
    auth.signOut().then(function() {
        localStorage.setItem("key", "")
        localStorage.setItem("login", false)
        location.href = "/login.html"
      }).catch(function(error) {
        // Mostra un messaggio di errore
        alert("Errore: " + error.message);
      });
}

function is_login(func = null, red = true) {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            if (func != null) { 
                func()
            }
        } else {
            if (red) {location.href = "/login.html"}
        }
      });
}
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {localStorage.setItem("uid", user.uid)}
});
