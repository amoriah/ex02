import { statusTitle, statusView, timeSpan } from '../script.js';

export const clearStatus = () =>
  setTimeout(() => {
    statusTitle.innerHTML = 'Свободная линия';
    statusView.style.background = 'rgb(110, 230, 244)';
    timeSpan.innerHTML = 'Время звонка: -';
  }, 3000);
