import React, { useState, useEffect } from 'react';
import { teaRecordService } from '../services/api';
import './Statistics.css';

function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await teaRecordService.getStatistics();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      alert('获取统计数据失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (!stats) {
    return <div className="error">无法加载统计数据</div>;
  }

  return (
    <div className="statistics">
      <h2>奶茶统计</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🧋</div>
          <div className="stat-value">{stats.totalCount}</div>
          <div className="stat-label">总共喝了</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-value">{stats.recentCount}</div>
          <div className="stat-label">最近7天</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value">¥{stats.totalSpent.toFixed(2)}</div>
          <div className="stat-label">总花费</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-value">{stats.averageRating.toFixed(1)}</div>
          <div className="stat-label">平均评分</div>
        </div>

        <div className="stat-card favorite">
          <div className="stat-icon">❤️</div>
          <div className="stat-value">{stats.favoriteBrand}</div>
          <div className="stat-label">最爱品牌</div>
        </div>
      </div>

      <div className="stats-summary">
        <h3>消费分析</h3>
        <p>
          你总共喝了 <strong>{stats.totalCount}</strong> 杯奶茶，
          平均每杯花费 <strong>¥{stats.totalCount > 0 ? (stats.totalSpent / stats.totalCount).toFixed(2) : 0}</strong>。
        </p>
        <p>
          最近7天喝了 <strong>{stats.recentCount}</strong> 杯，
          平均每天 <strong>{(stats.recentCount / 7).toFixed(1)}</strong> 杯。
        </p>
        <p>
          你最喜欢的品牌是 <strong>{stats.favoriteBrand}</strong>！
        </p>
      </div>
    </div>
  );
}

export default Statistics;
