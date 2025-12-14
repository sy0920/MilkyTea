const app = getApp();

const BASE_URL = 'http://localhost:8080'; // Backend base from README

function buildUrl(url, params) {
  if (!params || Object.keys(params).length === 0) return BASE_URL + url;
  const qs = Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  return BASE_URL + url + '?' + qs;
}

function request(method, url, data = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    const token = (app && app.globalData && app.globalData.token) || wx.getStorageSync('token');
    const finalHeaders = Object.assign({
      'Content-Type': 'application/json'
    }, headers);
    if (token) {
      finalHeaders['Authorization'] = `Bearer ${token}`;
    }
    const fullUrl = method === 'GET' ? buildUrl(url, data) : (BASE_URL + url);
    wx.request({
      url: fullUrl,
      method,
      data: method === 'GET' ? undefined : data,
      header: finalHeaders,
      success(res) {
        const { statusCode, data } = res;
        if (statusCode >= 200 && statusCode < 300) {
          resolve(data);
        } else if (statusCode === 401) {
          reject({ code: 401, message: 'Unauthorized' });
        } else {
          reject({ code: statusCode, message: (data && data.message) || 'Request failed' });
        }
      },
      fail(err) {
        reject({ code: -1, message: err.errMsg || 'Network error' });
      }
    });
  });
}

function get(url, params) { return request('GET', url, params); }
function post(url, body) { return request('POST', url, body); }
function put(url, body) { return request('PUT', url, body); }
function del(url, body) { return request('DELETE', url, body); }

module.exports = { request, get, post, put, del };
