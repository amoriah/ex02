import { clearTime, updateFields } from './utils/timer.js';
import { clearStatus, changeStatus } from './utils/status.js';
import { Status } from './utils/status.js';
import { addHistory } from './utils/history.js';

const blockLogin = document.querySelector('.login-block');
const loginForm = document.querySelector('.form');
const content = document.querySelector('.content-wrapper');
const terminateBtns = document.querySelectorAll('.terminate');
const startCall = document.querySelector('.start-call-btn');
const answerCall = document.querySelector('.answer-call-btn');
const stopCall = document.querySelector('.stop-call-btn');
const stopIncoming = document.querySelector('.stop-incoming-call');
const resetCall = document.querySelector('.reset-call');
const sipNumber = document.querySelector('.sip-num');
const waiting = document.querySelector('.waiting-icon');

var ua, config, session, intervalId, currentCallStatus;

const andCallStatus = {
  'Canceled': 'пропущенный',
  'Rejected': 'отклонённый',
  'Incoming': 'входящий',
  'Outcoming': 'исходящий',
};

loginForm.addEventListener('submit', e => {
  e.preventDefault();

  const login = document.querySelector('.input_login').value;
  const password = document.querySelector('.input_password').value;
  const server = document.querySelector('.input_server').value;

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
      changeStatus(
        Status.ringing,
        [waiting, startCall],
        [answerCall, resetCall]
      );

      session.on('accepted', function () {
        console.log('[ INCOMING CALL ACCEPTED ]');
        changeStatus(Status.connect, [answerCall, resetCall], [stopIncoming]);

        intervalId = setInterval(() => {
          updateFields();
        }, 1000);
      });
      session.on('ended', function () {
        console.log('[ INCOMING CALL ENDED ]');
        clearStatus();
        changeStatus(
          Status.finish,
          [answerCall, stopIncoming, resetCall],
          [waiting, startCall]
        );
        clearInterval(intervalId);
        clearTime();
        addHistory(
          session.end_time,
          andCallStatus['Incoming'],
          sipNumber.value
        );
      });
      session.on('failed', function (e) {
        console.log('[ INCOMING CALL FAILED ]: ', e.cause);
        clearStatus();
        changeStatus(
          Status.interrupted,
          [answerCall, stopIncoming, resetCall],
          [waiting]
        );
        console.log('andCallStatus[e.cause]', andCallStatus[e.cause]);
        addHistory(new Date(), andCallStatus[e.cause], sipNumber.value);
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
      currentCallStatus = Status.ringing;
    },
    'failed': function (e) {
      console.log('[ CALL FAILED WITH ]: ' + e.cause);
      clearStatus();
      changeStatus(Status.interrupted, [stopCall], [startCall]);

      addHistory(new Date(), andCallStatus['Outcoming'], sipNumber.value);
      clearInterval(intervalId);
      clearTime();
    },
    'ended': function (e) {
      console.log('[ CALL ENDED ]');
      clearStatus();
      changeStatus(Status.finish, [stopCall], [startCall]);
      clearInterval(intervalId);
      clearTime();

      addHistory(session.end_time, andCallStatus['Outcoming'], sipNumber.value);
    },
    'confirmed': function (e) {
      console.log('[ CALL CONFIRMED ]');
      changeStatus(Status.connect, [], []);
      currentCallStatus = Status.connect;
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

answerCall.addEventListener('click', () => {
  console.log('[REPLY BUTTON CLICK]');
  session.answer({
    mediaConstraints: {
      audio: true,
      video: false,
    },
  });
});

terminateBtns.forEach(button => {
  button.addEventListener('click', () => {
    if (session) {
      console.log('[ STOP BUTTON CLICK -> TERMINATE SESSION ]');
      ua.terminateSessions();
    }
  });
});
