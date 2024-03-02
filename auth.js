const loginForm = document.getElementById('form');
const blockLogin = document.getElementById('login-block');
const blockPhone = document.getElementById('phone-block');
const startCall = document.getElementById('start-call-btn');
const endCall = document.getElementById('end-call-btn');
const sipNumber = document.getElementById('num');
var ua;
var config;

loginForm.addEventListener('submit', e => {
  e.preventDefault();

  const login = document.getElementById('login').value;
  const password = document.getElementById('password').value;
  const server = document.getElementById('server').value;

  JsSIP.debug.enable('JsSIP:*');
  const socket = new JsSIP.WebSocketInterface('wss://' + server);
  config = {
    sockets: [socket],
    uri: 'sip:' + login + '@' + server,
    port: 9050,
    password: password,
    display_name: 'PC client',
    register: true,
  };

  ua = new JsSIP.UA(config);

  ua.start();

  ua.on('registered', function (e) {
    console.log('[ SUCCESS REGISTERED ]');
  });
  ua.on('registrationFailed', function (e) {
    console.log('[ FAILED REGISTERED ]: ', e.cause);
  });
  ua.on('connected', function () {
    console.log('[ SUCCESS CONECTED ]');
    blockLogin.style.display = 'none';
    blockPhone.style.display = 'block';
  });
  ua.on('disconnected', function (e) {
    console.log('[ DISCONNECTED ]: ', e.cause);
    blockLogin.style.display = 'block';
    blockPhone.style.display = 'none';
  });
});

startCall.addEventListener('click', () => {
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
  const options = {
    'eventHandlers': eventHandlers,
    'mediaConstraints': {
      'audio': true,
      'video': false,
    },
  };
  console.log(sipNumber.value);
  const session = ua.call(
    `sip:${sipNumber.value}@voip.uiscom.ru:9050`,
    options
  );
  console.log('session', session);
  // phone.terminateSessions();
});
