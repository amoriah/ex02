

const loginForm = document.getElementById("form");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const login = document.getElementById("login").value;
  const password = document.getElementById("password").value;
  const server = document.getElementById("server").value;

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
