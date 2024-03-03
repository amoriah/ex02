const loginForm = document.getElementById('form');
const blockLogin = document.getElementById('login-block');
const blockOutcoming = document.getElementById('phone-outcoming-block');
const blockIncoming = document.getElementById('phone-incoming-block');
const startCall = document.getElementById('start-call-btn');
const stopCall = document.getElementById('stop-call-btn');
const answerCall = document.getElementById('answer-call-btn');
const sipNumber = document.getElementById('num');

var ua, config, session, incomingSession;

const sessionDescriptionHandlerOptions = {
  peerConnectionOptions: {
    iceServers: [{ urls: `sip:${sipNumber.value}@voip.uiscom.ru` }],
  },
};

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
    // port: 9050,
    // display_name: 'PC client',
    // sessionDescriptionHandlerOptions: sessionDescriptionHandlerOptions,
  };

  ua = new JsSIP.UA(config);

  ua.on('newRTCSession', function (data) {
    incomingSession = data.session;

    if (incomingSession.direction === 'incoming') {
      blockIncoming.style.display = 'block';
      incomingSession.on('accepted', function () {
        console.log('[ INCOMING CALL ACCEPTED ]');
      });
      incomingSession.on('ended', function () {
        blockIncoming.style.display = 'none';
        console.log('[ INCOMING CALL ENDED ]');
      });
      incomingSession.on('failed', function (e) {
        console.log('[ INCOMING CALL FAILED ]: ', e.cause);
      });
    }

    // session.answer();
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
    blockOutcoming.style.display = 'block';
  });
  ua.on('disconnected', function (e) {
    console.log('[ DISCONNECTED ]: ', e.cause);
    blockLogin.style.display = 'block';
    blockOutcoming.style.display = 'none';
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
    'pcConfig': {
      hackStripTcp: true, // Важно для хрома, чтоб он не тупил при звонке
      rtcpMuxPolicy: 'negotiate', // Важно для хрома, чтоб работал multiplexing. Эту штуку обязательно нужно включить на астере.
      iceServers: [],
    },
    'rtcOfferConstraints': {
      offerToReceiveAudio: 1, // Принимаем только аудио
      offerToReceiveVideo: 0,
    },
  };
  session = ua.call(`sip:${sipNumber.value}@voip.uiscom.ru:9050`, options);
});

//отбой исходящего звонка
stopCall.addEventListener('click', () => {
  if (session || incomingSession) {
    ua.terminateSessions();
    console.log('[ STOP BUTTON CLICK -> TERMINATE SESSION ]');
  }
});
//входящий звонок

answerCall.addEventListener('click', () => {
  console.log('[REPLY BUTTON CLICK]');
  incomingSession.answer({
    mediaConstraints: {
      audio: true,
      video: false,
    },
  });
  answerCall.style.display = 'none';
});

const incomingCallOptions = {
  eventHandlers: {
    'progress': console.info,
    'failed': console.error,
    'ended': console.info,
    'accepted': console.info,
  },
  'mediaConstraints': {
    'audio': true,
    'video': false,
  },
  'pcConfig': {
    hackStripTcp: true, // Важно для хрома, чтоб он не тупил при звонке
    rtcpMuxPolicy: 'negotiate', // Важно для хрома, чтоб работал multiplexing. Эту
    //  штуку обязательно нужно включить на астере.
    iceServers: [],
  },
  'rtcOfferConstraints': {
    offerToReceiveAudio: 1, // Принимаем только аудио
    offerToReceiveVideo: 0,
  },
};

ua.invite(`sip:${sipNumber.value}@voip.uiscom.ru:9050`, incomingCallOptions);
