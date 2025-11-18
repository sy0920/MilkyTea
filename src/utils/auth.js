const TOKEN_KEY = 'milkytea_token'
const USER_KEY = 'milkytea_user'

export function setToken(token) {
    try { localStorage.setItem(TOKEN_KEY, token) } catch (e) { }
}

export function getToken() {
    try { return localStorage.getItem(TOKEN_KEY) } catch (e) { return null }
}

export function removeToken() {
    try { localStorage.removeItem(TOKEN_KEY) } catch (e) { }
}

export function setUser(user) {
    try { localStorage.setItem(USER_KEY, JSON.stringify(user)) } catch (e) { }
}

export function getUser() {
    try { const v = localStorage.getItem(USER_KEY); return v ? JSON.parse(v) : null } catch (e) { return null }
}

export function removeUser() {
    try { localStorage.removeItem(USER_KEY) } catch (e) { }
}

export function clearAuth() {
    removeToken(); removeUser()
}

export default { setToken, getToken, removeToken, setUser, getUser, removeUser, clearAuth }
