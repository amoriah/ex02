export const statusTitle = document.querySelector('.status-title');
export const statusView = document.querySelector('.status');
export const timeSpan = document.querySelector('.time');

export const Status = {
  idle: 'Ожидание',
  ringing: 'Вызов',
  connect: 'В процессе',
  finish: 'Завершено',
  interrupted: 'Прервано',
};

export const andCallStatus = {
  'Canceled': 'пропущенный',
  'Rejected': 'отклонённый',
  'Incoming': 'входящий',
  'Outcoming': 'исходящий',
};

export const clearStatus = () =>
  setTimeout(() => {
    statusTitle.innerHTML = Status.idle;
    statusView.style.background = 'rgb(110, 230, 244)';
    timeSpan.innerHTML = 'Длительность: -';
  }, 3000);

export const changeStatus = status => {
  const color = {
    'Ожидание': 'rgb(110, 230, 244)',
    'Вызов': 'orange',
    'В процессе': 'rgb(31, 245, 31)',
    'Завершено': 'red',
    'Прервано': 'red',
  }[status];
  statusTitle.innerHTML = status;
  statusView.style.background = color;
};
