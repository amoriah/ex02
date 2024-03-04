import { sipNumber, startCall, stopCall } from '../script.js';
import { clearStatus } from './status.js';
import { clearTime } from './timer.js';

export const stopAnimation = () => {
  stopCall.style.animation = 'none';
  startCall.style.animation = 'none';
  startCall.style.pointerEvents = 'auto';
  sipNumber.textContent = '';
};

export const printNumber = value => {
  sipNumber.textContent = sipNumber.textContent + value;
};

export const clear = intervalId => {
  clearStatus();
  clearInterval(intervalId);
  clearTime();
  stopAnimation();
};
