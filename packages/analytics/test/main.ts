import { OpenAnalytics } from '../src/index';

const btn1 = document.querySelector('#btn1');

const oa = new OpenAnalytics();

btn1?.addEventListener('click', () => {
  oa.report('btn-click', {
    date: Date.now(),
  });
});
