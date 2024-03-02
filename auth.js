const loginForm = document.getElementById('form');
const _socket = new JsSIP.WebSocketInterface('wss://voip.uiscom.ru');
var _ua = new JsSIP.UA({
  sockets: [_socket],
  uri: 'sip:0336443@voip.uiscom.ru',
  password: 'fLkFmpFFm5',
});

loginForm.addEventListener('submit', e => {
  e.preventDefault();

  const login = document.getElementById('login').value;
  const password = document.getElementById('password').value;
  const server = document.getElementById('server').value;

  JsSIP.debug.enable('JsSIP:*');
  const socket = new JsSIP.WebSocketInterface('wss://' + server);
  const configuration = {
    sockets: [socket],
    uri: 'sip:' + login + '@' + server,
    password: password,
    authorization_user: 'PC',
    display_name: 'PC client',
    register: true, // регистрация по умолчанию
  };

  const phone = new JsSIP.UA(configuration);

  phone.on('connected', function (e) {
    console.log('connected e=', e);
  });

  phone.start();

  const eventHandlers = {
    'progress': function (e) {
      console.log('Call is in progress');
    },
    'failed': function (e) {
      console.log('Call failed with cause: ' + e.cause);
    },
    'ended': function (e) {
      console.log('Call ended with cause: ' + e.cause);
    },
    'confirmed': function (e) {
      console.log('Call confirmed');
    },
  };

  // Опции вызова
  var options = {
    'eventHandlers': eventHandlers,
    'mediaConstraints': { 'audio': true, 'video': true },
  };

  phone.call('sip:0336442@example.com', options);

  // window.location.href = "./index.html";
});
