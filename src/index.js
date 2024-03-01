// import JsSIP from "jssip";
import jssip from 'jssip';
const start = document.getElementById("start-btn");
const loginForm = document.getElementById("form");

start.addEventListener("click", () => {
    console.log('click')
  chrome.tabs.create({ url: "./login/login.html" });
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const login = document.getElementById("login").value;
  const password = document.getElementById("password").value;
  const server = document.getElementById("server").value;

  var socket = new jssip.WebSocketInterface("wss://" + server);
  var configuration = {
    sockets: [socket],
    uri: "sip:" + login + "@" + server,
    password: password,
  };

  var ua = new jssip.UA(configuration);

  ua.start();
  ua.register();
});

/*

Учетные данные 1:
Сервер: voip.uiscom.ru
Порт (если нужен): 9050
Логин: 0336442
Пароль: XLRkng2BfE

Учетные данные 2:
Сервер: voip.uiscom.ru
Порт (если нужен): 9050
Логин: 0336443
Пароль: fLkFmpFFm5
*/
