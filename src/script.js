import { changeStatus } from './handlers/status.js';
import { Status } from './handlers/status.js';
import { printNumber, stopAnimation } from './handlers/utils.js';
import outcoming from './handlers/outcoming.js';
import incoming from './handlers/incoming.js';
import register from './handlers/register.js';

const loginForm = document.querySelector('.form');
export const startCall = document.querySelector('.start-call-icon');
export const stopCall = document.querySelector('.end-call-icon');
export const sipNumber = document.querySelector('.input');
export var ua, session;
const clear = document.querySelector('.clear');

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const login = document.querySelector('.input_login').value;
  const password = document.querySelector('.input_password').value;
  const server = document.querySelector('.input_server').value;
  const socket = new JsSIP.WebSocketInterface('wss://' + server);
  const config = {
    sockets: [socket],
    uri: 'sip:' + login + '@' + server,
    password: password,
    register: true,
  };

  ua = new JsSIP.UA(config);
  ua.on('newRTCSession', function (data) {
    session = data.session;

    if (session.direction === 'incoming') {
      console.log('[ INCOMING CALL ]');
      changeStatus(Status.ringing);
      sipNumber.textContent = session.remote_identity.uri.user;
      stopCall.style.animation = 'flicker 200ms infinite';
      startCall.style.animation = 'flicker 200ms infinite';
      session.on('accepted', incoming.accepted);
      session.on('ended', () =>
        incoming.ended(session.remote_identity.uri.user)
      );
      session.on('failed', e =>
        incoming.failed(e, session.remote_identity.uri.user)
      );
    }
  });

  ua.start();
  ua.on('registered', register.registered);
  ua.on('registrationFailed', e => register.failed(e));
  ua.on('connected', register.connected);
  ua.on('disconnected', e => register.disconnected(e));
});

document.querySelector('.buttons').onclick = event => {
  const clickElement = event.target.classList;
  if (clickElement.contains('num')) printNumber(event.target.textContent);
};

clear.addEventListener('click', () => {
  console.log('[ CLEAR CLICK ]');
  const newLine = sipNumber.textContent.slice(0, -1);
  sipNumber.textContent = newLine;
});

startCall.addEventListener('click', () => {
  if (!sipNumber.textContent) {
    alert('Введите номер');
    return;
  }
  const eventHandlers = {
    'progress': () => outcoming.progress(sipNumber.textContent),
    'failed': e => outcoming.fail(e),
    'ended': outcoming.end,
    'confirmed': outcoming.confirm,
  };

  const options = {
    'eventHandlers': eventHandlers,
    'mediaConstraints': {
      'audio': true,
      'video': false,
    },
  };

  if (session && session.direction === 'incoming') {
    session.answer({
      mediaConstraints: {
        audio: true,
        video: false,
      },
    });
  } else {
    session = ua.call(
      `sip:${sipNumber.textContent}@voip.uiscom.ru:9050`,
      options
    );
  }
});

stopCall.addEventListener('click', () => {
  if (session) {
    console.log('[ STOP BUTTON CLICK -> TERMINATE SESSION ]');
    stopAnimation();
    ua.terminateSessions();
  }
});
