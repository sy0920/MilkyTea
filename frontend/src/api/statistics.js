import request from '../utils/request'

// 获取基础统计
export async function getSummary({ startDate, endDate } = {}) {
    let path = '/api/statistics/summary'
    const params = []
    if (startDate) params.push(`startDate=${encodeURIComponent(startDate)}`)
    if (endDate) params.push(`endDate=${encodeURIComponent(endDate)}`)
    if (params.length) path += `?${params.join('&')}`
    return await request(path, { method: 'GET' })
}

// 获取品牌统计
export async function getBrandStats({ startDate, endDate } = {}) {
    let path = '/api/statistics/brands'
    const params = []
    if (startDate) params.push(`startDate=${encodeURIComponent(startDate)}`)
    if (endDate) params.push(`endDate=${encodeURIComponent(endDate)}`)
    if (params.length) path += `?${params.join('&')}`
    return await request(path, { method: 'GET' })
}

// 获取趋势分析
export async function getTrends({ startDate, endDate, groupBy = 'day' } = {}) {
    let path = '/api/statistics/trends'
    const params = []
    if (startDate) params.push(`startDate=${encodeURIComponent(startDate)}`)
    if (endDate) params.push(`endDate=${encodeURIComponent(endDate)}`)
    if (groupBy) params.push(`groupBy=${groupBy}`)
    if (params.length) path += `?${params.join('&')}`
    return await request(path, { method: 'GET' })
}

// 获取日历月度数据
export async function getCalendarData(year, month) {
    return await request(`/api/statistics/calendar/${year}/${month}`, { method: 'GET' })
}

// 兼容性方法 - 获取月度统计
export async function getMonthlyStats(year, month) {
    return await getCalendarData(year, month)
}

export default {
    getSummary,
    getBrandStats,
    getTrends,
    getCalendarData,
    getMonthlyStats
}
