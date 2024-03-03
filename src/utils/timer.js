import { timeSpan } from '../script.js';
let time = { h: 0, m: 0, s: 0 };
let upTime = {
  upH: time.h,
  upM: time.m,
  upS: time.s,
};

export function clearTime() {
  time = { h: 0, m: 0, s: 0 };
  upTime = {
    upH: time.h,
    upM: time.m,
    upS: time.s,
  };
}

export const updateFields = () => {
  if (upTime.upM === 60) {
    upTime.upH++;
    upTime.upM = 0;
  }
  if (upTime.upS === 60) {
    upTime.upM++;
    upTime.upS = 0;
  }
  upTime.upS++;
  time = {
    h: upTime.upH,
    m: upTime.upM,
    s: upTime.upS,
  };
  const h = time.h < 10 ? '0' + time.h : time.h;
  const m = time.m < 10 ? '0' + time.m : time.m;
  const s = time.s < 10 ? '0' + time.s : time.s;
  const view = { h, m, s };
  timeSpan.innerHTML = `Время звонка: ${view.h}:${view.m}:${view.s}`;
};
