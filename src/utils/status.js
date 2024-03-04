export const statusTitle = document.querySelector('.status-title');
export const statusView = document.querySelector('.status');
export const timeSpan = document.querySelector('.time');

export const Status = {
  idle: 'Свободная линия',
  ringing: 'Вызов',
  connect: 'Соединение установлено',
  finish: 'Соединение завершено',
  interrupted: 'Соединение прервано',
};

export const clearStatus = () =>
  setTimeout(() => {
    statusTitle.innerHTML = Status.idle;
    statusView.style.background = 'rgb(110, 230, 244)';
    timeSpan.innerHTML = 'Время звонка: -';
  }, 3000);

export const changeStatus = (status, hiddenItems, viewItems) => {
  const color = {
    'Свободная линия': 'rgb(110, 230, 244)',
    'Вызов': 'orange',
    'Соединение установлено': 'rgb(31, 245, 31)',
    'Соединение завершено': 'red',
    'Соединение прервано': 'red',
  }[status];
  statusTitle.innerHTML = status;
  statusView.style.background = color;
  hiddenItems.forEach(item => (item.hidden = true));
  viewItems.forEach(item => (item.hidden = false));
};
