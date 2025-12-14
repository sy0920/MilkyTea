const app = getApp();

function getToken() {
  return (app && app.globalData && app.globalData.token) || wx.getStorageSync('token') || '';
}

function setToken(token) {
  if (app) app.globalData.token = token;
  wx.setStorageSync('token', token);
}

function clearToken() {
  if (app) app.globalData.token = '';
  wx.removeStorageSync('token');
}

function isAuthenticated() {
  const token = getToken();
  return !!token;
}

module.exports = {
  getToken,
  setToken,
  clearToken,
  isAuthenticated
};

