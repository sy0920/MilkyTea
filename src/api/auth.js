import request from '../utils/request'
import { setToken, setUser, removeToken, removeUser } from '../utils/auth'

export async function register(payload) {
    const data = await request('/api/auth/register', {
        method: 'POST',
        body: payload
    })
    // expected to contain token + user info
    if (data && data.token) {
        setToken(data.token)
        setUser({ id: data.userId, username: data.username, email: data.email })
    }
    return data
}

export async function login(payload) {
    const data = await request('/api/auth/login', {
        method: 'POST',
        body: payload
    })
    if (data && data.token) {
        setToken(data.token)
        setUser({ id: data.userId, username: data.username, email: data.email })
    }
    return data
}

export async function logout() {
    removeToken(); removeUser();
}

export async function getProfile() {
    return await request('/api/user/profile')
}

export async function updateProfile(payload) {
    return await request('/api/user/profile', { method: 'PUT', body: payload })
}

export async function changePassword(payload) {
    return await request('/api/user/change-password', { method: 'POST', body: payload })
}

export default { register, login, logout, getProfile, updateProfile, changePassword }
