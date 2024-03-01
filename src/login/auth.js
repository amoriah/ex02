// const JsSIP = require("jssip");

// const loginForm = document.getElementById("form");
// // const SubmitBtn = document.getElementById("submit-button");
// /*

// Учетные данные 1:
// Сервер: voip.uiscom.ru
// Порт (если нужен): 9050
// Логин: 0336442
// Пароль: XLRkng2BfE

// Учетные данные 2:
// Сервер: voip.uiscom.ru
// Порт (если нужен): 9050
// Логин: 0336443
// Пароль: fLkFmpFFm5
// */

// loginForm.addEventListener("submit", (e) => {
//   e.preventDefault();

//   const login = document.getElementById("login").value;
//   const password = document.getElementById("password").value;
//   const server = document.getElementById("server").value;

//   // Инициализация JsSIP
//   var socket = new JsSIP.WebSocketInterface("wss://" + server);
//   var configuration = {
//     sockets: [socket],
//     uri: "sip:" + login + "@" + server,
//     password: password,
//   };

//   var ua = new JsSIP.UA(configuration);

//   // Регистрация на сервере SIP
//   ua.start();
//   ua.register();

// //   if (login === "admin" && password === "123" && server === "123") {
// //     alert("Login successful");
// //     window.location.href = "../index.html";
// //   } else {
// //     alert("Incorrect username or password");
// //   }
// });
