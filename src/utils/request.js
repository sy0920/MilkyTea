const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8080'

function getToken() {
    try {
        return localStorage.getItem('milkytea_token')
    } catch (e) {
        return null
    }
}

async function request(path, options = {}) {
    const url = path.startsWith('http') ? path : `${BASE_URL}${path}`
    const headers = options.headers || {}
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
    if (!headers['Content-Type'] && options.body && !(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json'
    }

    const fetchOptions = Object.assign({}, options, { headers })
    if (fetchOptions.body && typeof fetchOptions.body === 'object' && !(fetchOptions.body instanceof FormData)) {
        fetchOptions.body = JSON.stringify(fetchOptions.body)
    }

    const res = await fetch(url, fetchOptions)
    const text = await res.text()
    let data = null
    try { data = text ? JSON.parse(text) : null } catch (e) { data = text }
    if (!res.ok) {
        const err = new Error(data && data.message ? data.message : res.statusText)
        err.status = res.status
        err.body = data
        throw err
    }
    return data
}

export default request
