import { OpenAnalytics, InnerEventKey } from '../src/index';

const btn1 = document.querySelector('#btn1');
const btnOpen = document.querySelector('#btn-open');
const btnClose = document.querySelector('#btn-close');

const oa = new OpenAnalytics({
  appKey: 'test',
  request: (data) => {
    return new Promise((resolve, _reject) => {
      console.log('request to send content', data);
      resolve();
    });
  },
  // immediate: true,
});
function enabledOA(enabled) {
  oa.enableReporting(enabled);
  localStorage.setItem('enabled', enabled ? '1' : '0');
}
if (localStorage.getItem('enabled') !== '1') {
  enabledOA(false);
}

oa.report(InnerEventKey.PV, () => ({
  id: 'home',
}));

btn1?.addEventListener('click', () => {
  // window.open('/');
  console.log('btn1 clicked');

  oa.report('btn-click', {
    date: Date.now(),
  });
});

btnOpen?.addEventListener('click', () => {
  enabledOA(true);
});
btnClose?.addEventListener('click', () => {
  enabledOA(false);
});
