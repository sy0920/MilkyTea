<script setup>
import { computed } from 'vue'

const props = defineProps({
  records: {
    type: Array,
    default: () => []
  }
})

// 计算统计数据
const stats = computed(() => {
  const totalCups = props.records.length
  const totalCost = props.records.reduce((sum, record) => sum + (record.price || 0), 0)
  const avgPrice = totalCups > 0 ? totalCost / totalCups : 0

  // 品牌统计
  const brandCount = {}
  props.records.forEach(record => {
    const brandName = record.brandName || record.brand
    if (brandName) {
      brandCount[brandName] = (brandCount[brandName] || 0) + 1
    }
  })

  // 排序并取前5
  const topBrands = Object.entries(brandCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // 最近记录（按日期排序）
  const recentRecords = [...props.records]
    .sort((a, b) => {
      const dateA = new Date(a.consumeDate || a.date)
      const dateB = new Date(b.consumeDate || b.date)
      return dateB - dateA
    })
    .slice(0, 5)

  return {
    totalCups,
    totalCost,
    avgPrice,
    topBrands,
    recentRecords
  }
})

const maxCount = computed(() => {
  return stats.value.topBrands.length > 0 ? stats.value.topBrands[0][1] : 1
})
</script>

<template>
  <div class="stats-summary">
    <h2 class="section-title">消费统计</h2>

    <!-- 概览卡片 -->
    <div class="overview-cards">
      <div class="stat-card cost-card">
        <div class="stat-icon">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">累计消费</p>
          <p class="stat-value cost-value">¥{{ stats.totalCost.toFixed(1) }}</p>
        </div>
      </div>

      <div class="stat-card cups-card">
        <div class="stat-icon">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 11h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2z"></path>
            <path d="M7 7V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v4"></path>
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">总杯数</p>
          <p class="stat-value cups-value">{{ stats.totalCups }}<span class="stat-unit">杯</span></p>
        </div>
      </div>

      <div class="stat-card avg-card">
        <div class="stat-icon">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">平均单价</p>
          <p class="stat-value avg-value">¥{{ stats.avgPrice.toFixed(1) }}</p>
        </div>
      </div>
    </div>

    <!-- 品牌偏好 -->
    <div class="brand-analysis">
      <h3 class="subsection-title">
        <svg class="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline>
        </svg>
        品牌偏好 Top 5
      </h3>
      <div class="brand-chart">
        <div v-for="[brand, count] in stats.topBrands" :key="brand" class="brand-item">
          <span class="brand-name">{{ brand }}</span>
          <div class="brand-bar-container">
            <div
              class="brand-bar"
              :style="{ width: `${(count / maxCount) * 100}%` }"
            ></div>
          </div>
          <span class="brand-count">{{ count }}杯</span>
        </div>
        <p v-if="stats.topBrands.length === 0" class="empty-state">暂无数据</p>
      </div>
    </div>

    <!-- 近期记录 -->
    <div class="recent-records">
      <h3 class="subsection-title">近期记录</h3>
      <div class="records-table">
        <table v-if="stats.recentRecords.length > 0">
          <thead>
            <tr>
              <th>日期</th>
              <th>品牌</th>
              <th>金额</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in stats.recentRecords" :key="record.id">
              <td class="record-date">{{ (record.consumeDate || record.date).slice(5) }}</td>
              <td class="record-brand">{{ record.brandName || record.brand }} - {{ record.category }}</td>
              <td class="record-price">¥{{ record.price }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else class="empty-state">暂无记录</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-summary {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: fade-in 0.5s ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--mt-text-main);
  margin: 0;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: var(--mt-white);
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: var(--mt-transition);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.cost-card {
  border-left: 4px solid var(--mt-primary);
}

.cups-card {
  border-left: 4px solid #3B82F6;
}

.avg-card {
  border-left: 4px solid #8B5CF6;
}

.stat-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cost-card .stat-icon {
  background: rgba(212, 165, 116, 0.1);
  color: var(--mt-primary);
}

.cups-card .stat-icon {
  background: rgba(59, 130, 246, 0.1);
  color: #3B82F6;
}

.avg-card .stat-icon {
  background: rgba(139, 92, 246, 0.1);
  color: #8B5CF6;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--mt-text-light);
  margin: 0 0 0.25rem 0;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.cost-value {
  color: var(--mt-primary);
}

.cups-value {
  color: #3B82F6;
}

.avg-value {
  color: #8B5CF6;
}

.stat-unit {
  font-size: 0.75rem;
  color: var(--mt-text-light);
  font-weight: 400;
}

.brand-analysis, .recent-records {
  background: var(--mt-white);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.subsection-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--mt-text-main);
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title-icon {
  width: 1.125rem;
  height: 1.125rem;
  color: var(--mt-primary);
}

.brand-chart {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.brand-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-name {
  width: 4rem;
  font-size: 0.875rem;
  color: var(--mt-text-light);
  flex-shrink: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.brand-bar-container {
  flex: 1;
  height: 0.75rem;
  background: var(--mt-input-bg);
  border-radius: 9999px;
  overflow: hidden;
}

.brand-bar {
  height: 100%;
  background: var(--mt-primary);
  border-radius: 9999px;
  transition: width 0.5s ease-out;
}

.brand-count {
  font-size: 0.75rem;
  color: var(--mt-text-light);
  width: 2rem;
  text-align: right;
  flex-shrink: 0;
}

.records-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  text-align: left;
  padding: 0.75rem 1rem;
  background: var(--mt-input-bg);
  color: var(--mt-text-main);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  font-weight: 600;
}

thead th:first-child {
  border-radius: 0.5rem 0 0 0.5rem;
}

thead th:last-child {
  border-radius: 0 0.5rem 0.5rem 0;
}

tbody td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #F3F4F6;
}

tbody tr:hover {
  background: var(--mt-input-bg);
}

.record-date {
  color: var(--mt-text-light);
  font-size: 0.875rem;
}

.record-brand {
  color: var(--mt-text-main);
  font-weight: 500;
  font-size: 0.875rem;
}

.record-price {
  color: var(--mt-primary);
  font-weight: 600;
  text-align: right;
}

.empty-state {
  text-align: center;
  color: var(--mt-text-light);
  font-size: 0.875rem;
  padding: 1rem;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .overview-cards {
    grid-template-columns: 1fr;
  }

  .stat-value {
    font-size: 1.25rem;
  }

  .brand-analysis, .recent-records {
    padding: 1rem;
  }
}
</style>

<style scoped>

</style>