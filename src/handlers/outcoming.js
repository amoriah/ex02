import { session, startCall, stopCall } from '../script.js';
import { addHistory } from './history.js';
import { Status, andCallStatus, changeStatus } from './status.js';
import { updateFields } from './timer.js';
import { clear } from './utils.js';

let intervalId, number;

const confirm = () => {
  console.log('[ CALL CONFIRMED ]');
  changeStatus(Status.connect);
  intervalId = setInterval(() => {
    updateFields();
  }, 1000);
};
const progress = sipNumber => {
  console.log('[ CALL IN PROGRESS ]');
  changeStatus(Status.ringing);
  startCall.style.pointerEvents = 'none';
  stopCall.style.animation = 'flicker 200ms infinite';
  number = sipNumber;
};
const fail = e => {
  console.log('[ CALL FAILED WITH ]: ' + e.cause);
  changeStatus(Status.interrupted);
  clear(intervalId);
  addHistory(new Date(), andCallStatus['Outcoming'], number);
};
const end = () => {
  console.log('[ CALL ENDED ]');
  changeStatus(Status.finish);
  clear(intervalId);
  addHistory(session.end_time, andCallStatus['Outcoming'], number);
};

const outcoming = {
  confirm,
  progress,
  fail,
  end,
};

export default outcoming;
