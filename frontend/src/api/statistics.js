import request from '../utils/request'

export async function getSummary({ startDate, endDate } = {}) {
    let path = '/api/statistics/summary'
    const params = []
    if (startDate) params.push(`startDate=${encodeURIComponent(startDate)}`)
    if (endDate) params.push(`endDate=${encodeURIComponent(endDate)}`)
    if (params.length) path += `?${params.join('&')}`
    return await request(path, { method: 'GET' })
}

export default { getSummary }
