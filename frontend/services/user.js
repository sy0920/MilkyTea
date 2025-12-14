const { get, put, post } = require('./request/http');

function getUserInfo() {
  return get('/api/user/profile');
}

function updateUserProfile(profileData) {
  return put('/api/user/profile', profileData);
}

function updateUserInfo(userData) {
  return put('/api/user/profile', userData);
}

function updateUsername(newUsername) {
  return post('/api/user/username', { newUsername });
}

function updatePassword(oldPassword, newPassword) {
  return post('/api/user/change-password', { oldPassword, newPassword });
}

module.exports = {
  getUserInfo,
  updateUserProfile,
  updateUserInfo,
  updateUsername,
  updatePassword
};
