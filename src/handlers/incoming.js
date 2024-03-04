import { session, startCall } from '../script.js';
import { addHistory } from './history.js';
import { Status, andCallStatus, changeStatus } from './status.js';
import { updateFields } from './timer.js';
import { clear } from './utils.js';

let intervalId;

const accepted = () => {
  console.log('[ INCOMING CALL ACCEPTED ]');
  changeStatus(Status.connect);
  startCall.style.animation = 'none';
  startCall.style.pointerEvents = 'none';
  intervalId = setInterval(() => {
    updateFields();
  }, 1000);
};

const ended = number => {
  console.log('[ INCOMING CALL ENDED ]');
  changeStatus(Status.finish);
  clear(intervalId);

  addHistory(session.end_time, andCallStatus['Incoming'], number);
};

const failed = (e, number) => {
  console.log('[ INCOMING CALL FAILED ]: ', e.cause);
  changeStatus(Status.interrupted);
  clear(intervalId);
  addHistory(new Date(), andCallStatus[e.cause], number);
};

const incoming = {
  accepted,
  ended,
  failed,
};

export default incoming;
