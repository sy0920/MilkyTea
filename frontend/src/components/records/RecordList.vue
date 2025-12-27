<script setup>
import { ref, computed, watch } from 'vue'
import { searchRecords } from '../../api/records'

const props = defineProps({
  records: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['editRecord'])

const searchQuery = ref('')
const isSearching = ref(false)
const searchResult = ref(null)
const loading = ref(false)
const error = ref('')

// 搜索功能
const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    isSearching.value = false
    searchResult.value = null
    return
  }

  loading.value = true
  error.value = ''
  try {
    const res = await searchRecords(searchQuery.value)
    searchResult.value = res
    isSearching.value = true
  } catch (e) {
    error.value = '搜索失败，请稍后重试'
    console.error(e)
  } finally {
    loading.value = false
  }
}

// 监听搜索框清空
watch(searchQuery, (newVal) => {
  if (!newVal.trim()) {
    isSearching.value = false
    searchResult.value = null
  }
})

// 显示的记录列表
const displayRecords = computed(() => {
  if (isSearching.value && searchResult.value) {
    return searchResult.value.myRecords
  }
  return props.records
})

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

const onRecordClick = (record) => {
  emit('editRecord', record)
}
</script>

<template>
  <div class="record-list-module">
    <div class="header-section">
      <h2 class="section-title">记录列表</h2>
      <div class="search-bar">
        <input 
          v-model="searchQuery" 
          @keyup.enter="handleSearch"
          type="text" 
          placeholder="搜索奶茶名称..." 
          class="search-input"
        />
        <button @click="handleSearch" class="search-btn" :disabled="loading">
          <span v-if="loading">搜索中...</span>
          <span v-else>搜索</span>
        </button>
      </div>
    </div>

    <!-- 搜索结果统计卡片 -->
    <div v-if="isSearching && searchResult" class="search-stats-card">
      <div class="stat-item">
        <span class="label">品类名称</span>
        <span class="value">{{ searchResult.category }}</span>
      </div>
      <div class="stat-item">
        <span class="label">全网平均评分</span>
        <span class="value highlight">
          {{ searchResult.averageRating ? searchResult.averageRating.toFixed(1) : '暂无' }}
        </span>
      </div>
      <div class="stat-item">
        <span class="label">全网记录数</span>
        <span class="value">{{ searchResult.totalCount }}</span>
      </div>
    </div>

    <div v-if="error" class="error-message">{{ error }}</div>

    <!-- 记录列表 -->
    <div class="records-container">
      <table class="records-table" v-if="displayRecords.length > 0">
        <thead>
          <tr>
            <th>日期</th>
            <th>品牌</th>
            <th>品类</th>
            <th>价格</th>
            <th>评分</th>
            <th>评语</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="record in displayRecords" 
            :key="record.id" 
            class="record-row"
            @click="onRecordClick(record)"
          >
            <td>{{ formatDate(record.consumeDate || record.date) }}</td>
            <td>
              <div class="brand-info">
                <img :src="record.brandLogo || '/default-brand-icon.png'" class="brand-logo" alt="logo" />
                <span>{{ record.brandName || record.brand }}</span>
              </div>
            </td>
            <td>{{ record.category }}</td>
            <td>¥{{ record.price }}</td>
            <td>
              <span class="rating-badge">{{ record.rating || record.score }}</span>
            </td>
            <td class="comment-cell" :title="record.comment">{{ record.comment || '-' }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">
        <p>暂无记录</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.record-list-module {
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

.search-bar {
  display: flex;
  gap: 8px;
  flex: 1;
  max-width: 400px;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #8B4513;
}

.search-btn {
  padding: 8px 16px;
  background-color: #8B4513;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-btn:hover {
  background-color: #5D4037;
}

.search-btn:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

.search-stats-card {
  display: flex;
  gap: 24px;
  background: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid #faf6f1;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-item .label {
  font-size: 0.875rem;
  color: #718096;
}

.stat-item .value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
}

.stat-item .value.highlight {
  color: #8B4513;
}

.error-message {
  color: #e53e3e;
  margin-bottom: 16px;
}

.records-table {
  width: 100%;
  border-collapse: collapse;
}

.records-table th {
  text-align: left;
  padding: 12px;
  background-color: #f8fafc;
  color: #4a5568;
  font-weight: 600;
  border-bottom: 2px solid #edf2f7;
}

.records-table td {
  padding: 12px;
  border-bottom: 1px solid #edf2f7;
  color: #2d3748;
}

.record-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.record-row:hover {
  background-color: #f7fafc;
}

.brand-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-logo {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.rating-badge {
  background-color: #FFF8DC;
  color: #8B4513;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
}

.comment-cell {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #718096;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #a0aec0;
}

@media (max-width: 640px) {
  .header-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-bar {
    max-width: none;
  }
  
  .records-table th:nth-child(4),
  .records-table td:nth-child(4),
  .records-table th:nth-child(6),
  .records-table td:nth-child(6) {
    display: none;
  }
}
</style>