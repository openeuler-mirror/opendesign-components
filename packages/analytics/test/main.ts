import { OpenAnalytics } from '../src/index';

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
oa.enableReporting(false);

oa.report('$PageView', {
  url: window.location.href,
  path: window.location.pathname,
  hash: window.location.hash,
  title: document.title,
});

btn1?.addEventListener('click', () => {
  // window.open('/');
  console.log('btn1 clicked');

  oa.report('btn-click', {
    date: Date.now(),
  });
});

btnOpen?.addEventListener('click', () => {
  oa.enableReporting();
});
btnClose?.addEventListener('click', () => {
  oa.enableReporting(false);
});
