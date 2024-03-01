const loginForm = document.getElementById("form");
//https://habr.com/ru/articles/507554/
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

  const ua = new JsSIP.UA(configuration);

  ua.start();
  ua.register();
  window.location.href = "./index.html";
});

var socket = new JsSIP.WebSocketInterface("wss://voip.uiscom.ru");
var ua = new JsSIP.UA({
  sockets: [socket],
  uri: "sip:0336443@voip.uiscom.ru",
  password: "fLkFmpFFm5",
});

const remoteAudio = new window.Audio();
remoteAudio.autoplay = true;

// События регистрации клиента
ua.on("connected", function (e) {
  /* Ваш код */
});
ua.on("disconnected", function (e) {
  /* Ваш код */
});

ua.on("registered", function (e) {
  /* Ваш код */
});
ua.on("unregistered", function (e) {
  /* Ваш код */
});
ua.on("registrationFailed", function (e) {
  /* Ваш код */
});

// Обработка событии исх. звонка
var eventHandlers = {
  progress: function (e) {
    console.log("call is in progress");

    session.connection.ontrack = function (e) {
      console.log(e);
      remoteAudio.srcObject = e.streams[0];
    };
  },
  failed: function (e) {
    console.log("call failed with cause: " + e.cause);
    $("#call").css({ display: "flex" });
    $("#hangup").css({ display: "none" });
  },
  ended: function (e) {
    console.log("call ended with cause: " + e.cause);
    $("#call").css({ display: "flex" });
    $("#hangup").css({ display: "none" });
  },
  confirmed: function (e) {
    console.log("call confirmed");
    console.log(e);
  },
};

var options = {
  eventHandlers: eventHandlers,
  mediaConstraints: { audio: true, video: false },
};

// // Кнопка для звонка
// $("#call").click(function (e) {
//   session = ua.call($("#num").val(), options);
//   $("#call").css({ display: "none" });
//   $("#hangup").css({ display: "flex" });
// });

// // Кнопка для отбоя звонка
// $("#hangup").click(function () {
//   if (session) {
//     session.terminate();
//   }

//   $("#call").css({ display: "flex" });
//   $("#hangup").css({ display: "none" });
// });
