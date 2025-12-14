const { get } = require('./request/http');

function getSummary() {
  return get('/api/statistics/summary');
}

function getBrandStats() {
  return get('/api/statistics/brands');
}

function getTrends() {
  return get('/api/statistics/trends');
}

module.exports = {
  getSummary,
  getBrandStats,
  getTrends
};
