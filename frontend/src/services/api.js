import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const teaRecordService = {
  getAllRecords: () => api.get('/tea-records'),
  getRecordById: (id) => api.get(`/tea-records/${id}`),
  createRecord: (record) => api.post('/tea-records', record),
  updateRecord: (id, record) => api.put(`/tea-records/${id}`, record),
  deleteRecord: (id) => api.delete(`/tea-records/${id}`),
  getStatistics: () => api.get('/tea-records/statistics'),
};

export default api;
