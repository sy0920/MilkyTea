const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8080'

function getToken() {
    try {
        return localStorage.getItem('milkytea_token')
    } catch (e) {
        return null
    }
}

// 错误消息映射表
const ERROR_MESSAGES = {
    400: '请求参数有误,请检查输入信息',
    401: '未登录或登录已过期,请重新登录',
    403: '没有权限执行此操作',
    404: '请求的资源不存在',
    409: '数据冲突,请刷新后重试',
    500: '服务器出错了,请稍后再试',
    502: '网络错误,请检查网络连接',
    503: '服务暂时不可用,请稍后再试'
}

// 友好的错误提示
function getFriendlyErrorMessage(status, serverMessage) {
    // 如果服务器返回了中文错误消息,优先使用
    if (serverMessage && /[\u4e00-\u9fa5]/.test(serverMessage)) {
        // 过滤掉技术性词汇
        return serverMessage
            .replace(/RuntimeException:|Exception:|Error:/gi, '')
            .replace(/at .*$/gm, '')
            .replace(/java\..*?:/gi, '')
            .trim()
    }
    
    // 使用预定义的友好消息
    return ERROR_MESSAGES[status] || '操作失败,请稍后重试'
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

    try {
        const res = await fetch(url, fetchOptions)
        const text = await res.text()
        let data = null
        try { data = text ? JSON.parse(text) : null } catch (e) { data = text }
        
        if (!res.ok) {
            const serverMessage = data?.message || data?.error || ''
            const friendlyMessage = getFriendlyErrorMessage(res.status, serverMessage)
            
            const err = new Error(friendlyMessage)
            err.status = res.status
            err.body = data
            err.originalMessage = serverMessage
            throw err
        }
        return data
    } catch (error) {
        // 网络错误
        if (!error.status) {
            const networkError = new Error('网络连接失败,请检查网络后重试')
            networkError.status = 0
            throw networkError
        }
        throw error
    }
}

export default request
