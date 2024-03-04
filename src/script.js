import { clearTime, updateFields } from './utils/timer.js';
import { clearStatus, changeStatus } from './utils/status.js';
import { Status } from './utils/status.js';

export const statusTitle = document.querySelector('.status-title');
export const statusView = document.querySelector('.status');
export const timeSpan = document.querySelector('.time');

const loginForm = document.getElementById('form');
const blockLogin = document.getElementById('login-block');
const sipNumber = document.getElementById('num');

const startCall = document.querySelector('.start-call-btn');
const answerCall = document.querySelector('.answer-call-btn');
const stopCall = document.querySelector('.stop-call-btn');
const stopIncoming = document.querySelector('.stop-incoming-call');

const content = document.querySelector('.content-wrapper');
const waiting = document.querySelector('.waiting-icon');

var ua, config, session, intervalId;

loginForm.addEventListener('submit', e => {
  e.preventDefault();

  const login = document.getElementById('login').value;
  const password = document.getElementById('password').value;
  const server = document.getElementById('server').value;

  // JsSIP.debug.enable('JsSIP:*');
  const socket = new JsSIP.WebSocketInterface('wss://' + server);
  config = {
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
      changeStatus(Status.ringing, [waiting], [answerCall]);

      session.on('accepted', function () {
        console.log('[ INCOMING CALL ACCEPTED ]');
        changeStatus(Status.connect, [answerCall], [stopIncoming]);
        intervalId = setInterval(() => {
          updateFields();
        }, 1000);
      });
      session.on('ended', function () {
        console.log('[ INCOMING CALL ENDED ]');
        clearStatus();
        changeStatus(Status.finish, [answerCall, stopIncoming], [waiting]);
        clearInterval(intervalId);
        clearTime();
      });
      session.on('failed', function (e) {
        console.log('[ INCOMING CALL FAILED ]: ', e.cause);
        clearStatus();
        changeStatus(Status.interrupted, [answerCall, stopIncoming], [waiting]);
        clearInterval(intervalId);
        clearTime();
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

startCall.addEventListener('click', () => {
  const eventHandlers = {
    'progress': function (e) {
      console.log('[ CALL IN PROGRESS ]');
      changeStatus(Status.ringing, [startCall], [stopCall]);
    },
    'failed': function (e) {
      console.log('[ CALL FAILED WITH ]: ' + e.cause);
      clearStatus();
      changeStatus(Status.interrupted, [stopCall], [startCall]);
      clearInterval(intervalId);
      clearTime();
    },
    'ended': function (e) {
      console.log('[ CALL ENDED ]');
      clearStatus();
      changeStatus(Status.finish, [stopCall], [startCall]);
      clearInterval(intervalId);
      clearTime();
    },
    'confirmed': function (e) {
      console.log('[ CALL CONFIRMED ]');
      changeStatus(Status.connect, [], []);
      intervalId = setInterval(() => {
        updateFields();
      }, 1000);
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
  if (session) {
    ua.terminateSessions();
    console.log('[ STOP BUTTON CLICK -> TERMINATE SESSION ]');
  }
});

stopIncoming.addEventListener('click', () => {
  if (session) {
    ua.terminateSessions();
    console.log('[ STOP BUTTON CLICK -> TERMINATE SESSION ]');
  }
});

answerCall.addEventListener('click', () => {
  console.log('[REPLY BUTTON CLICK]');
  session.answer({
    mediaConstraints: {
      audio: true,
      video: false,
    },
  });
});
