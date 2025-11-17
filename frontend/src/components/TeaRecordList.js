import React, { useState, useEffect } from 'react';
import { teaRecordService } from '../services/api';
import './TeaRecordList.css';

function TeaRecordList({ refreshTrigger }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, [refreshTrigger]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await teaRecordService.getAllRecords();
      // Sort by date descending (newest first)
      const sortedRecords = response.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRecords(sortedRecords);
    } catch (error) {
      console.error('Error fetching records:', error);
      alert('获取记录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('确定要删除这条记录吗？')) {
      try {
        await teaRecordService.deleteRecord(id);
        fetchRecords();
        alert('删除成功');
      } catch (error) {
        console.error('Error deleting record:', error);
        alert('删除失败');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating);
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (records.length === 0) {
    return (
      <div className="empty-state">
        <h3>还没有记录</h3>
        <p>快去添加你的第一杯奶茶吧！</p>
      </div>
    );
  }

  return (
    <div className="tea-record-list">
      <h2>奶茶记录 ({records.length})</h2>
      <div className="records-grid">
        {records.map(record => (
          <div key={record.id} className="record-card">
            <div className="record-header">
              <h3>{record.brand}</h3>
              <button 
                className="delete-btn" 
                onClick={() => handleDelete(record.id)}
                title="删除"
              >
                🗑️
              </button>
            </div>
            <div className="record-body">
              <p><strong>品类:</strong> {record.category}</p>
              <p><strong>甜度:</strong> {record.sweetness}</p>
              <p><strong>冰度:</strong> {record.iceLevel}</p>
              <p><strong>价格:</strong> ¥{record.price.toFixed(2)}</p>
              <p className="rating">
                <strong>评分:</strong> {renderStars(record.rating)} ({record.rating}/10)
              </p>
              {record.comment && (
                <p className="comment"><strong>评语:</strong> {record.comment}</p>
              )}
              <p className="date">{formatDate(record.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeaRecordList;
