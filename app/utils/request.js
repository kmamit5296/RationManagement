import 'whatwg-fetch';

function parseJSON(response) {
  return response.json().then(data => {
    return Object.assign(response, { data });
  });
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response.data);
  }
  return Promise.reject(response);
}

export default function request(url, options) {
  options = options || {};
  options.headers = options.headers || {};

  if (localStorage.token) {
    options.headers['authorization-token'] = localStorage.token;
  }

  return fetch(url, options).then(parseJSON).then(checkStatus);
}
