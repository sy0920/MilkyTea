import request from '../utils/request'

// 获取所有品牌 (公开接口)
export async function getAllBrands() {
  return await request('/api/brands', { method: 'GET' })
}

// 获取品牌详情 (公开接口)
export async function getBrandDetail(id) {
  return await request(`/api/brands/${id}`, { method: 'GET' })
}

// 创建品牌 (需认证)
export async function createBrand(brandData) {
  // 数据验证 - 匹配后端 @NotBlank 验证
  if (!brandData.name || brandData.name.trim().length === 0) {
    throw new Error('品牌名称不能为空')
  }

  // 品牌名称长度验证 (数据库字段通常为VARCHAR(255))
  if (brandData.name.trim().length > 50) {
    throw new Error('品牌名称不能超过50个字符')
  }

  // 构建符合后端Schema的请求数据
  const requestData = {
    name: brandData.name.trim(),                               // @NotBlank String name
    description: brandData.description || '用户自定义品牌',      // String description (可选)
    logoUrl: brandData.logoUrl || null                         // String logoUrl (外部URL或null)
  }

  console.log('🚀 发送品牌创建请求 (符合后端Schema):', {
    name: requestData.name,
    description: requestData.description,
    logoUrl: requestData.logoUrl || 'null'
  })

  return await request('/api/brands', {
    method: 'POST',
    body: JSON.stringify(requestData),
    headers: { 'Content-Type': 'application/json' }
  })
}

// 删除品牌 (需认证)
export async function deleteBrand(id) {
  return await request(`/api/brands/${id}`, { method: 'DELETE' })
}

// 兼容性方法 - 获取用户自定义品牌列表
export async function getUserBrands() {
  // 返回所有品牌，前端可以过滤用户创建的品牌
  return await getAllBrands()
}

// 兼容性方法 - 添加自定义品牌
export async function addCustomBrand(brandName) {
  return await createBrand({
    name: brandName,
    description: '用户自定义品牌'
  })
}

// 兼容性方法 - 删除自定义品牌
export async function deleteCustomBrand(brandId) {
  return await deleteBrand(brandId)
}

export default {
  getAllBrands,
  getBrandDetail,
  createBrand,
  deleteBrand,
  getUserBrands,
  addCustomBrand,
  deleteCustomBrand
}
