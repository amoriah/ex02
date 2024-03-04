const list = document.querySelector('.history-list');

let history = [];

export const addHistory = (time, type, number) => {
  console.log('[ ADD HISTORY ]');
  const h = time.getHours();
  const m = time.getMinutes();
  const newHistoryItem = {
    endTime: `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`,
    type: type,
    sipNumber: number,
  };

  const li = document.createElement('li');
  for (let key in newHistoryItem) {
    const span = document.createElement('span');
    span.textContent = newHistoryItem[key];
    li.appendChild(span);
  }
  list.appendChild(li);
  history.push(newHistoryItem);
};
