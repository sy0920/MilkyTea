const { post } = require('./request/http');
const authStore = require('../stores/auth');
const userStore = require('../stores/user');

async function login(payload) {
  const data = await post('/api/auth/login', payload);
  if (data && data.token) {
    authStore.setToken(data.token);
    userStore.setUser({
      id: data.userId,
      username: data.username,
      phone: data.phone,
      avatar: data.avatar || null
    });
  }
  return data;
}

async function register(payload) {
  const data = await post('/api/auth/register', payload);
  if (data && data.token) {
    authStore.setToken(data.token);
    userStore.setUser({
      id: data.userId,
      username: data.username,
      phone: data.phone,
      avatar: data.avatar || null
    });
  }
  return data;
}

function logout() {
  authStore.setToken('');
  userStore.clearUser();
}

module.exports = {
  login,
  register,
  logout
};

