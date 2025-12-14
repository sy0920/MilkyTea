const { get, post, put, del } = require('./request/http');

function getRecords(params) {
  return get('/api/records', params);
}

function createRecord(recordData) {
  const backendData = {
    brandId: recordData.brandId,
    category: recordData.category,
    sweetness: recordData.sugar || recordData.sweetness,
    iceLevel: recordData.ice || recordData.iceLevel,
    price: recordData.price,
    rating: recordData.score || recordData.rating,
    comment: recordData.comment || '',
    consumeDate: recordData.date || recordData.consumeDate
  };
  return post('/api/records', backendData);
}

function updateRecord(id, recordData) {
  const backendData = {
    brandId: recordData.brandId,
    category: recordData.category,
    sweetness: recordData.sugar || recordData.sweetness,
    iceLevel: recordData.ice || recordData.iceLevel,
    price: recordData.price,
    rating: recordData.score || recordData.rating,
    comment: recordData.comment || '',
    consumeDate: recordData.date || recordData.consumeDate
  };
  return put(`/api/records/${id}`, backendData);
}

function getRecordDetail(id) {
  return get(`/api/records/${id}`);
}

function deleteRecord(id) {
  return del(`/api/records/${id}`);
}

module.exports = {
  getRecords,
  createRecord,
  updateRecord,
  getRecordDetail,
  deleteRecord
};


