const { get, post, del } = require('./request/http');

function getAllBrands() {
  return get('/api/brands');
}

function getBrandDetail(id) {
  return get(`/api/brands/${id}`);
}

function createBrand(brandData) {
  if (!brandData.name || brandData.name.trim().length === 0) {
    throw new Error('品牌名称不能为空');
  }
  if (brandData.name.trim().length > 50) {
    throw new Error('品牌名称不能超过50个字符');
  }

  const requestData = {
    name: brandData.name.trim(),
    description: brandData.description || '用户自定义品牌',
    logoUrl: brandData.logoUrl || null
  };

  return post('/api/brands', requestData);
}

function deleteBrand(id) {
  return del(`/api/brands/${id}`);
}

module.exports = {
  getAllBrands,
  getBrandDetail,
  createBrand,
  deleteBrand
};

