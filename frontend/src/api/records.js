import request from '../utils/request'

// 获取奶茶记录
export async function getRecords({ date, startDate, endDate, brandId, category, page, size } = {}) {
  let path = '/api/records'
  const params = []

  if (date) params.push(`date=${encodeURIComponent(date)}`)
  if (startDate) params.push(`startDate=${encodeURIComponent(startDate)}`)
  if (endDate) params.push(`endDate=${encodeURIComponent(endDate)}`)
  if (brandId) params.push(`brandId=${brandId}`)
  if (category) params.push(`category=${encodeURIComponent(category)}`)
  if (page !== undefined) params.push(`page=${page}`)
  if (size !== undefined) params.push(`size=${size}`)

  if (params.length) path += `?${params.join('&')}`
  return await request(path, { method: 'GET' })
}

// 创建奶茶记录
export async function createRecord(recordData) {
  // 转换前端字段到后端字段
  const backendData = {
    brandId: recordData.brandId,
    category: recordData.category,
    sweetness: recordData.sugar || recordData.sweetness, // 支持两种字段名
    iceLevel: recordData.ice || recordData.iceLevel,
    price: recordData.price,
    rating: recordData.score || recordData.rating,
    comment: recordData.comment || '',
    consumeDate: recordData.date || recordData.consumeDate
  }

  return await request('/api/records', {
    method: 'POST',
    body: JSON.stringify(backendData),
    headers: { 'Content-Type': 'application/json' }
  })
}

// 更新奶茶记录
export async function updateRecord(id, recordData) {
  // 转换前端字段到后端字段
  const backendData = {
    brandId: recordData.brandId,
    category: recordData.category,
    sweetness: recordData.sugar || recordData.sweetness,
    iceLevel: recordData.ice || recordData.iceLevel,
    price: recordData.price,
    rating: recordData.score || recordData.rating,
    comment: recordData.comment || '',
    consumeDate: recordData.date || recordData.consumeDate
  }

  return await request(`/api/records/${id}`, {
    method: 'PUT',
    body: JSON.stringify(backendData),
    headers: { 'Content-Type': 'application/json' }
  })
}

// 获取单个记录详情
export async function getRecordDetail(id) {
  return await request(`/api/records/${id}`, { method: 'GET' })
}

// 删除奶茶记录
export async function deleteRecord(id) {
  return await request(`/api/records/${id}`, { method: 'DELETE' })
}

export default {
  getRecords,
  createRecord,
  updateRecord,
  getRecordDetail,
  deleteRecord
}
