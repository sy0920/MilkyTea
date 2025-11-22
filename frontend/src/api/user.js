
import request from '../utils/request'

// 获取用户信息
export async function getUserInfo() {
  return await request('/api/user/profile', { method: 'GET' })
}

// 更新用户信息 (手机号、头像)
export async function updateUserProfile(profileData) {
  return await request('/api/user/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
    headers: { 'Content-Type': 'application/json' }
  })
}

// 修改用户名
export async function updateUsername(newUsername) {
  return await request('/api/user/username', {
    method: 'PATCH',
    body: JSON.stringify({ newUsername }),
    headers: { 'Content-Type': 'application/json' }
  })
}

// 修改密码
export async function updatePassword(oldPassword, newPassword) {
  return await request('/api/user/change-password', {
    method: 'POST',
    body: JSON.stringify({ oldPassword, newPassword }),
    headers: { 'Content-Type': 'application/json' }
  })
}

export default {
  getUserInfo,
  updateUserProfile,
  updateUsername,
  updatePassword
}
