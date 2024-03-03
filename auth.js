const loginForm = document.getElementById('form');
const blockLogin = document.getElementById('login-block');
const blockPhone = document.getElementById('phone-block');
const startCall = document.getElementById('start-call-btn');
const stopCall = document.getElementById('stop-call-btn');
const sipNumber = document.getElementById('num');
var ua, config, session;


//подключение к серверу
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

//исходящий звонок
startCall.addEventListener('click', () => {
  const eventHandlers = {
    'progress': function (e) {
      console.log('[ CALL IN PROGRESS ]');
    },
    'failed': function (e) {
      console.log('[ CALL FAILED WITH ]: ' + e.cause);
    },
    'ended': function (e) {
      console.log('[ CALL ENDED ]');
    },
    'confirmed': function (e) {
      console.log('[ CALL CONFIRMED ]');
    },
  };
  const options = {
    'eventHandlers': eventHandlers,
    'mediaConstraints': {
      'audio': true,
      'video': false,
    },
  };
  session = ua.call(`sip:${sipNumber.value}@voip.uiscom.ru:9050`, options);
});

//отбой исходящего звонка
stopCall.addEventListener('click', () => {
  if (session) {
    ua.terminateSessions();
    console.log('[ STOP CLICK -> TERMINATE SESSION ]');
  }
});
