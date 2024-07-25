import { OpenAnalytics, InnerEventKey } from '@opensig/open-analytics';

const oa = new OpenAnalytics({
  appKey: 'test',
  request: (data) => {
    console.log('request to send content', data);
    return fetch('report', {
      method: 'POST',
      body: JSON.stringify(data),
    }).then((response) => response.ok);
  },
});

export { oa, InnerEventKey };
