import request from '../utils/request'

export async function getRecords({ startDate, endDate } = {}) {
    let path = '/api/records'
    const params = []
    if (startDate) params.push(`startDate=${encodeURIComponent(startDate)}`)
    if (endDate) params.push(`endDate=${encodeURIComponent(endDate)}`)
    if (params.length) path += `?${params.join('&')}`
    return await request(path, { method: 'GET' })
}

export default { getRecords }
