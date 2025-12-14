const app = getApp();

function getUser() {
  return (app && app.globalData && app.globalData.user) || wx.getStorageSync('user') || null;
}

function setUser(user) {
  if (app) app.globalData.user = user;
  wx.setStorageSync('user', user);
}

function clearUser() {
  if (app) app.globalData.user = null;
  wx.removeStorageSync('user');
}

module.exports = { getUser, setUser, clearUser };
