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

const loginForm = document.getElementById("form");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const login = document.getElementById("login").value;
  const password = document.getElementById("password").value;
  const server = document.getElementById("server").value;
//   console.log(login, password, server);

  var socket = new JsSIP.WebSocketInterface("wss://" + server);
  var configuration = {
    sockets: [socket],
    uri: "sip:" + login + "@" + server,
    password: password,
  };

  var ua = new JsSIP.UA(configuration);

  ua.start();
  ua.register();
});

/*
Статус 101 Switching Protocols является одним из статусов HTTP, который обозначает успешное переключение протоколов. Этот статус обычно возвращается сервером в ответ на запрос клиента на смену протокола, например, при использовании веб-сокетов.

Когда клиент отправляет запрос серверу с заголовком Upgrade, сервер может вернуть статус 101 Switching Protocols, что означает, что сервер согласен переключиться на другой протокол, предложенный клиентом. После этого обе стороны могут продолжить общение по новому протоколу.

Таким образом, статус 101 Switching Protocols используется для согласования смены протокола между клиентом и сервером в рамках сеанса обмена данными.
*/