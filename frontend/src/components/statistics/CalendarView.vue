<script setup>
import { computed } from 'vue'
import { getDaysInMonth, getFirstDayOfMonth, formatDate } from '../../utils/constants'

const props = defineProps({
  currentDate: Date,
  records: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['dateSelect', 'monthChange'])

const calendarData = computed(() => {
  const year = props.currentDate.getFullYear()
  const month = props.currentDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  console.log('📅 Calendar computing:', {
    year,
    month: month + 1,
    totalRecords: props.records.length,
    sampleRecord: props.records[0]
  })

  const days = []
  // 添加前面的空白天数
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // 添加当月的天数
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = formatDate(new Date(year, month, i))
    const dayRecords = props.records.filter(r => {
      // 支持不同的日期字段格式
      const recordDate = r.consumeDate || r.date
      const matches = recordDate === dateStr
      if (matches) {
        console.log(`📅 Date match found for ${dateStr}:`, r)
      }
      return matches
    })

    // 计算总价格和品牌分组
    const totalPrice = dayRecords.reduce((sum, record) => {
      return sum + (record.price || 0)
    }, 0)

    // 按品牌分组记录
    const brandGroups = dayRecords.reduce((groups, record) => {
      const brandId = record.brandId
      const brandName = record.brandName || record.brand
      const brandLogo = record.brandLogo || '/default-brand-icon.png'

      if (!groups[brandId]) {
        groups[brandId] = {
          id: brandId,
          name: brandName,
          logo: brandLogo,
          count: 0
        }
      }
      groups[brandId].count++
      return groups
    }, {})

    days.push({
      day: i,
      date: dateStr,
      records: dayRecords,
      count: dayRecords.length,
      amount: totalPrice,
      hasConsumption: dayRecords.length > 0,
      brandGroups: Object.values(brandGroups)
    })
  }

  return days
})

const monthName = computed(() => {
  const year = props.currentDate.getFullYear()
  const month = props.currentDate.getMonth() + 1
  return `${year}年${month}月`
})

const goToPreviousMonth = () => {
  const newDate = new Date(props.currentDate)
  newDate.setMonth(newDate.getMonth() - 1)
  emit('monthChange', newDate)
}

const goToNextMonth = () => {
  const newDate = new Date(props.currentDate)
  newDate.setMonth(newDate.getMonth() + 1)
  emit('monthChange', newDate)
}

const handleDateClick = (dayData) => {
  if (dayData && dayData.records.length > 0) {
    emit('dateSelect', dayData)
  }
}
</script>

<template>
  <div class="calendar-view">
    <!-- 月份导航 -->
    <div class="calendar-header">
      <h2 class="month-title">{{ monthName }}</h2>
      <div class="nav-buttons">
        <button @click="goToPreviousMonth" class="nav-btn">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
        </button>
        <button @click="goToNextMonth" class="nav-btn">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- 日历网格 -->
    <div class="calendar-grid">
      <!-- 星期标题 -->
      <div class="weekday-header">
        <div v-for="day in ['日', '一', '二', '三', '四', '五', '六']"
             :key="day"
             class="weekday"
        >
          {{ day }}
        </div>
      </div>

      <!-- 日期网格 -->
      <div class="days-grid">
        <div
          v-for="(item, index) in calendarData"
          :key="index"
          class="day-cell"
          :class="{ 'has-records': item?.records.length > 0 }"
          @click="handleDateClick(item)"
        >
          <div v-if="item" class="day-content">
            <span class="day-number">{{ item.day }}</span>

            <!-- 品牌图标指示器 -->
            <div v-if="item.records.length > 0" class="brand-indicators">
              <div
                v-for="brandGroup in item.brandGroups"
                :key="brandGroup.id"
                class="brand-indicator"
                :title="`${brandGroup.name} ×${brandGroup.count}`"
              >
                <img
                  :src="brandGroup.logo || '/default-brand-icon.png'"
                  :alt="brandGroup.name"
                  class="brand-icon-mini"
                />
                <span v-if="brandGroup.count > 1" class="brand-count">×{{ brandGroup.count }}</span>
              </div>
            </div>

            <!-- 总价格 -->
            <div v-if="item.records.length > 0" class="total-price">
              ¥{{ item.records.reduce((sum, r) => sum + (r.price || 0), 0).toFixed(1) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-view {
  background: var(--mt-white);
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.month-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--mt-text-main);
  margin: 0;
}

.nav-buttons {
  display: flex;
  gap: 0.25rem;
}

.nav-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 0.5rem;
  color: var(--mt-text-light);
  transition: var(--mt-transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:hover {
  background-color: var(--mt-input-bg);
  color: var(--mt-text-main);
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.calendar-grid {
  width: 100%;
}

.weekday-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 0.5rem;
}

.weekday {
  text-align: center;
  font-size: 0.875rem;
  color: var(--mt-text-light);
  font-weight: 500;
  padding: 0.5rem;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
}

.day-cell {
  min-height: 5rem;
  border-radius: 0.75rem;
  transition: var(--mt-transition);
  cursor: pointer;
  background: var(--mt-input-bg);
  border: 1px solid transparent;
}

.day-cell.has-records {
  background: rgba(212, 165, 116, 0.1);
  border-color: rgba(212, 165, 116, 0.2);
}

.day-cell.has-records:hover {
  background: rgba(212, 165, 116, 0.15);
  border-color: var(--mt-primary);
  box-shadow: 0 2px 8px rgba(212, 165, 116, 0.2);
}

.day-content {
  padding: 0.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.day-number {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--mt-text-light);
}

.has-records .day-number {
  color: var(--mt-primary);
  font-weight: 600;
}

.record-indicators,
.brand-indicators {
  margin-top: 0.25rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.125rem;
  justify-content: center;
  min-height: 16px;
}

.brand-indicator {
  display: flex;
  align-items: center;
  gap: 1px;
  position: relative;
}

.brand-icon-mini {
  width: 12px;
  height: 12px;
  object-fit: cover;
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.brand-count {
  font-size: 0.625rem;
  color: var(--mt-primary);
  font-weight: 700;
  line-height: 1;
  margin-left: 1px;
}

.milk-tea-icon {
  color: var(--mt-primary);
  width: 1rem;
  height: 1rem;
}

.record-count {
  font-size: 0.75rem;
  color: var(--mt-primary);
  font-weight: 600;
}

.total-price {
  position: absolute;
  bottom: 0.25rem;
  right: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--mt-accent);
}

/* 响应式设计 */
@media (min-width: 768px) {
  .calendar-view {
    padding: 1.5rem;
  }

  .day-cell {
    min-height: 6.25rem;
  }

  .month-title {
    font-size: 1.75rem;
  }
}

@media (max-width: 640px) {
  .day-cell {
    min-height: 4rem;
  }

  .day-content {
    padding: 0.25rem;
  }

  .day-number {
    font-size: 0.75rem;
  }

  .total-price {
    font-size: 0.625rem;
  }
}
</style>
