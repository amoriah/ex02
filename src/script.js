const loginForm = document.getElementById('form');
const blockLogin = document.getElementById('login-block');
const startCall = document.getElementById('start-call-btn');
const stopCall = document.getElementById('stop-call-btn');
const answerCall = document.getElementById('answer-call-btn');
const sipNumber = document.getElementById('num');
const stopIncoming = document.getElementById('stop-incoming-call');

const content = document.querySelector('.content-wrapper');
const waiting = document.querySelector('.waiting-icon');
const statusTitle = document.querySelector('.status-title');
const statusView = document.querySelector('.status');

var ua, config, session, incomingSession;

let time = { h: 0, m: 0, s: 0 };

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
    password: password,
    register: true,
  };

  ua = new JsSIP.UA(config);

  ua.on('newRTCSession', function (data) {
    incomingSession = data.session;

    if (incomingSession.direction === 'incoming') {
      console.log('[ INCOMING CALL ]');

      statusTitle.innerHTML = 'Вызов';
      statusView.style.background = 'orange';
      answerCall.hidden = false;
      console.log('answerCall.hidden', answerCall.hidden);
      waiting.hidden = true;

      incomingSession.on('accepted', function () {
        statusTitle.innerHTML = 'Соединение установлено';
        statusView.style.background = 'rgb(31, 245, 31)';
        answerCall.hidden = true;
        stopIncoming.hidden = false;
        console.log('[ INCOMING CALL ACCEPTED ]');
        console.log('start_time', incomingSession.start_time);
      });
      incomingSession.on('ended', function () {
        setTimeout(() => {
          statusTitle.innerHTML = 'Свободная линия';
          statusView.style.background = 'rgb(110, 230, 244)';
        }, 3000);
        statusTitle.innerHTML = 'Соединение завершено';
        statusView.style.background = 'red';
        answerCall.hidden = true;
        stopIncoming.hidden = true;
        waiting.hidden = false;
        console.log('[ INCOMING CALL ENDED ]');

        console.log('end_time', incomingSession.end_time);
      });
      incomingSession.on('failed', function (e) {
        setTimeout(() => {
          statusTitle.innerHTML = 'Свободная линия';
          statusView.style.background = 'rgb(110, 230, 244)';
        }, 3000);
        statusTitle.innerHTML = 'Соединение прервано';
        statusView.style.background = 'red';

        answerCall.hidden = true;
        stopIncoming.hidden = true;
        waiting.hidden = false;
        console.log('[ INCOMING CALL FAILED ]: ', e.cause);
      });
    }
  });

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
    content.style.display = 'flex';
  });
  ua.on('disconnected', function (e) {
    console.log('[ DISCONNECTED ]: ', e.cause);
    blockLogin.style.display = 'block';
    content.style.display = 'none';
  });
});

//исходящий звонок
startCall.addEventListener('click', () => {
  const eventHandlers = {
    'progress': function (e) {
      console.log('[ CALL IN PROGRESS ]');
      statusTitle.innerHTML = 'Вызов';
      statusView.style.background = 'orange';

      startCall.style.display = 'none';
      stopCall.hidden = false;
    },
    'failed': function (e) {
      console.log('[ CALL FAILED WITH ]: ' + e.cause);
      setTimeout(() => {
        statusTitle.innerHTML = 'Свободная линия';
        statusView.style.background = 'rgb(110, 230, 244)';
      }, 3000);
      statusTitle.innerHTML = 'Соединение прервано';
      statusView.style.background = 'red';
      startCall.style.display = 'block';
      stopCall.hidden = true;
    },
    'ended': function (e) {
      console.log('[ CALL ENDED ]');
      setTimeout(() => {
        statusTitle.innerHTML = 'Свободная линия';
        statusView.style.background = 'rgb(110, 230, 244)';
      }, 3000);
      statusTitle.innerHTML = 'Соединение завершено';
      statusView.style.background = 'red';
      startCall.style.display = 'block';
      stopCall.hidden = true;
    },
    'confirmed': function (e) {
      console.log('[ CALL CONFIRMED ]');
      statusTitle.innerHTML = 'Соединение установлено';
      statusView.style.background = 'rgb(31, 245, 31)';
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

stopCall.addEventListener('click', () => {
  if (session || incomingSession) {
    ua.terminateSessions();
    console.log('[ STOP BUTTON CLICK -> TERMINATE SESSION ]');
  }
});

stopIncoming.addEventListener('click', () => {
  if (session || incomingSession) {
    ua.terminateSessions();
    console.log('[ STOP BUTTON CLICK -> TERMINATE SESSION ]');
  }
});

answerCall.addEventListener('click', () => {
  console.log('[REPLY BUTTON CLICK]');
  incomingSession.answer({
    mediaConstraints: {
      audio: true,
      video: false,
    },
  });
});
