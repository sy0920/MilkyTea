<script setup>
import { reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUser, removeToken, removeUser } from '../../utils/auth'
import { getRecords, createRecord, updateRecord, deleteRecord } from '../../api/records'
import { getAllBrands, createBrand } from '../../api/brands'
import { updateUserProfile, updateUsername, updatePassword } from '../../api/user'

// 组件导入
import AppLayout from '../../components/common/AppLayout.vue'
import CalendarView from '../../components/statistics/CalendarView.vue'
import StatsSummary from '../../components/statistics/StatsSummary.vue'
import RecordModal from '../../components/records/RecordModal.vue'
import ProfileModal from '../../components/common/ProfileModal.vue'
import ToastNotification from '../../components/common/ToastNotification.vue'

const router = useRouter()

// 响应式状态
const state = reactive({
  user: getUser(),
  records: [],
  allBrands: [], // 存储所有品牌（默认+自定义）
  currentTab: 'calendar',
  currentDate: new Date(),
  selectedDate: null,
  loading: true,

  // 模态框状态
  recordModalOpen: false,
  profileModalOpen: false,
  editingRecord: null,

  // Toast 状态
  toast: null
})

// 计算属性
const currentMonthStats = computed(() => {
  const year = state.currentDate.getFullYear()
  const month = state.currentDate.getMonth()

  const currentMonthRecords = state.records.filter(record => {
    const recordDate = new Date(record.date)
    return recordDate.getFullYear() === year && recordDate.getMonth() === month
  })

  const spent = currentMonthRecords.reduce((sum, record) => sum + (record.price || 0), 0)

  return { spent, count: currentMonthRecords.length }
})

const monthYearDisplay = computed(() => {
  const year = state.currentDate.getFullYear()
  const month = state.currentDate.getMonth() + 1
  return `${year}年${month}月`
})

// 工具函数
const showToast = (message, type = 'success') => {
  state.toast = { message, type }
}

const closeToast = () => {
  state.toast = null
}

// 数据加载
const loadData = async () => {
  try {
    state.loading = true

    const [recordsRes, brandsRes] = await Promise.all([
      getRecords(),
      getAllBrands()
    ])

    state.records = recordsRes || []
    state.allBrands = brandsRes || []

    // 调试信息
    console.log('📊 Data loaded:', {
      recordsCount: state.records.length,
      brandsCount: state.allBrands.length,
      sampleRecord: state.records[0],
      records: state.records
    })

  } catch (error) {
    console.error('加载数据失败:', error)
    showToast('数据加载失败', 'error')
  } finally {
    state.loading = false
  }
}

// 记录操作
const handleSaveRecord = async (recordData) => {
  try {
    let result
    if (recordData.id || state.editingRecord?.id) {
      // 更新记录
      const id = recordData.id || state.editingRecord.id
      result = await updateRecord(id, recordData)
      showToast('修改成功')

      // 立即更新selectedDate中的记录
      if (state.selectedDate) {
        const recordIndex = state.selectedDate.records.findIndex(r => r.id === id)
        if (recordIndex !== -1) {
          // 合并更新的数据
          state.selectedDate.records[recordIndex] = { ...state.selectedDate.records[recordIndex], ...result }
          // 重新计算总金额
          state.selectedDate.amount = state.selectedDate.records.reduce((sum, record) => sum + (record.price || 0), 0)
        }
      }
    } else {
      // 创建记录
      result = await createRecord(recordData)
      showToast('添加成功！一杯快乐已入账')
    }

    state.recordModalOpen = false
    state.editingRecord = null
    await loadData() // 重新加载数据

    // 在移动端，添加后回到日历视图
    if (window.innerWidth < 768) {
      state.currentTab = 'calendar'
    }

  } catch (error) {
    console.error('保存记录失败:', error)
    showToast('保存失败: ' + error.message, 'error')
  }
}

const handleDeleteRecord = async (id) => {
  try {
    await deleteRecord(id)
    showToast('记录已删除')

    // 立即更新选中日期的记录
    if (state.selectedDate) {
      state.selectedDate.records = state.selectedDate.records.filter(record => record.id !== id)
      state.selectedDate.count = state.selectedDate.records.length
      state.selectedDate.amount = state.selectedDate.records.reduce((sum, record) => sum + (record.price || 0), 0)
      state.selectedDate.hasConsumption = state.selectedDate.records.length > 0

      // 如果当前日期没有记录了，关闭模态框
      if (state.selectedDate.records.length === 0) {
        state.selectedDate = null
      }
    }

    await loadData() // 重新加载全部数据
  } catch (error) {
    console.error('删除记录失败:', error)
    showToast('删除失败: ' + error.message, 'error')
  }
}

const handleAddBrand = async (brandData) => {
  try {
    let newBrand
    if (typeof brandData === 'string') {
      // 兼容旧的字符串格式
      newBrand = await createBrand({
        name: brandData,
        description: '用户自定义品牌',
        logoUrl: '/default-brand-icon.png'
      })
    } else {
      // 新的对象格式，包含图标
      newBrand = await createBrand({
        name: brandData.name,
        description: '用户自定义品牌',
        logoUrl: brandData.logoUrl
      })
    }

    showToast(`已添加品牌: ${newBrand.name || brandData.name || brandData}`)

    // 重新加载数据以获取最新的品牌列表
    await loadData()

    // 返回新创建的品牌，以便可以自动选择
    return newBrand
  } catch (error) {
    console.error('添加品牌失败:', error)

    // 根据不同错误类型提供更具体的错误信息
    let errorMessage = '添加品牌失败'
    if (error.message.includes('品牌名称')) {
      errorMessage = error.message
    } else if (error.originalMessage && error.originalMessage.includes('Duplicate entry')) {
      errorMessage = '品牌名称已存在，请使用其他名称'
    } else if (error.originalMessage && error.originalMessage.includes('Data too long')) {
      errorMessage = '品牌图标过大，请使用较小的图片'
    } else if (error.status === 400) {
      errorMessage = '品牌信息格式错误，请检查输入'
    }

    showToast(errorMessage, 'error')
    throw error
  }
}

// 用户操作
const handleUpdateProfile = async (profileData) => {
  try {
    await updateUserProfile(profileData)
    // 更新本地用户信息
    state.user = { ...state.user, ...profileData }
    showToast('用户信息已更新')
  } catch (error) {
    console.error('更新用户信息失败:', error)
    showToast(error.message, 'error')
  }
}

const handleUpdateUsername = async (username) => {
  try {
    const updatedUser = await updateUsername(username)
    state.user = { ...state.user, username: updatedUser.username }
    showToast('用户名已更新')
  } catch (error) {
    console.error('更新用户名失败:', error)
    showToast(error.message, 'error')
  }
}

const handleUpdatePassword = async (oldPassword, newPassword) => {
  if (newPassword.length < 6) {
    showToast('密码太短', 'error')
    return
  }

  try {
    await updatePassword(oldPassword, newPassword)
    showToast('密码已更新')
  } catch (error) {
    console.error('更新密码失败:', error)
    showToast('更新失败: ' + error.message, 'error')
  }
}


const handleLogout = () => {
  removeToken()
  removeUser()
  router.push('/auth/login')
}

// 事件处理
const handleTabChange = (tab) => {
  if (tab === 'add') {
    state.editingRecord = null
    state.recordModalOpen = true
  } else {
    state.currentTab = tab
  }
}

const handleMonthChange = (newDate) => {
  state.currentDate = newDate
}

const handleDateSelect = (dayData) => {
  state.selectedDate = dayData
}

const handleEditRecord = (record) => {
  state.editingRecord = record
  state.recordModalOpen = true
  state.selectedDate = null
}

const goToPreviousMonth = () => {
  const newDate = new Date(state.currentDate)
  newDate.setMonth(newDate.getMonth() - 1)
  state.currentDate = newDate
}

const goToNextMonth = () => {
  const newDate = new Date(state.currentDate)
  newDate.setMonth(newDate.getMonth() + 1)
  state.currentDate = newDate
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<template>
  <AppLayout
    :user="state.user"
    :current-tab="state.currentTab"
    @tab-change="handleTabChange"
    @show-profile="state.profileModalOpen = true"
    @logout="handleLogout"
  >
    <!-- Toast 通知 -->
    <ToastNotification
      v-if="state.toast"
      :message="state.toast.message"
      :type="state.toast.type"
      @close="closeToast"
    />

    <!-- 加载状态 -->
    <div v-if="state.loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading Bobalog...</p>
    </div>

    <!-- 主要内容 -->
    <div v-else class="dashboard-content">
      <!-- 统计视图 -->
      <StatsSummary
        v-if="state.currentTab === 'stats'"
        :records="state.records"
      />

      <!-- 日历视图 -->
      <div v-else class="calendar-section">
        <!-- 头部信息 -->
        <div class="section-header">
          <div class="month-nav">
            <h2 class="month-title">{{ monthYearDisplay }}</h2>
            <div class="nav-controls">
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

          <!-- 预算卡片 -->
          <div class="add-record-section">
            <button
              @click="state.recordModalOpen = true"
              class="add-record-btn"
            >
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              添加记录
            </button>
          </div>
        </div>

        <!-- 日历组件 -->
        <CalendarView
          :current-date="state.currentDate"
          :records="state.records"
          @date-select="handleDateSelect"
          @month-change="handleMonthChange"
        />
      </div>
    </div>

    <!-- 选中日期详情模态框 -->
    <div v-if="state.selectedDate" class="date-modal-overlay" @click="state.selectedDate = null">
      <div class="date-modal-content" @click.stop>
        <div class="date-modal-header">
          <h3 class="date-modal-title">{{ state.selectedDate.date }} 消费明细</h3>
          <button @click="state.selectedDate = null" class="modal-close-btn">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="date-records">
          <div v-if="state.selectedDate.records.length === 0" class="empty-records">
            记录已全部删除
          </div>
          <div v-else class="record-list">
            <div
              v-for="record in state.selectedDate.records"
              :key="record.id"
              class="record-item"
            >
              <div class="record-info">
                <div class="record-emoji">🥤</div>
                <div class="record-details">
                  <p class="record-name">{{ record.brandName || record.brand }} | {{ record.category }}</p>
                  <p class="record-specs">{{ record.sweetness || record.sugar }} · {{ record.iceLevel || record.ice }} · {{ record.rating || record.score }}分</p>
                </div>
              </div>
              <div class="record-actions">
                <span class="record-price">¥{{ record.price }}</span>
                <button @click="handleEditRecord(record)" class="action-btn edit-btn">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button @click="handleDeleteRecord(record.id)" class="action-btn delete-btn">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3,6 5,6 21,6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="date-modal-footer">
          <button @click="state.selectedDate = null" class="close-modal-btn">关闭</button>
        </div>
      </div>
    </div>

    <!-- 记录模态框 -->
    <RecordModal
      :is-open="state.recordModalOpen"
      :initial-data="state.editingRecord"
      :available-brands="state.allBrands"
      @close="state.recordModalOpen = false; state.editingRecord = null"
      @save="handleSaveRecord"
      @add-brand="handleAddBrand"
    />

    <!-- 个人设置模态框 -->
    <ProfileModal
      :is-open="state.profileModalOpen"
      :user="state.user"
      @close="state.profileModalOpen = false"
      @update-profile="handleUpdateProfile"
      @update-username="handleUpdateUsername"
      @update-password="handleUpdatePassword"
      @logout="handleLogout"
    />
  </AppLayout>
</template>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  color: var(--mt-primary);
  gap: 1rem;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid var(--mt-input-bg);
  border-top: 2px solid var(--mt-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.dashboard-content {
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

.calendar-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.month-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.month-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--mt-text-main);
  margin: 0;
}

.nav-controls {
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
  background: var(--mt-input-bg);
  color: var(--mt-text-main);
}

.add-record-section {
  display: flex;
  justify-content: flex-end;
}

.add-record-btn {
  background: var(--mt-primary);
  color: var(--mt-white);
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: var(--mt-transition);
  box-shadow: 0 2px 4px rgba(212, 165, 116, 0.3);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.add-record-btn:hover {
  background: var(--mt-primary-dark);
  transform: translateY(-1px);
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* 日期详情模态框样式 */
.date-modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.date-modal-content {
  background: var(--mt-white);
  border-radius: 1rem;
  width: 100%;
  max-width: 28rem;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: modal-in 0.3s ease-out;
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-1rem);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.date-modal-header {
  padding: 1rem 1.5rem;
  background: var(--mt-input-bg);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date-modal-title {
  font-weight: 700;
  font-size: 1.125rem;
  color: var(--mt-text-main);
  margin: 0;
}

.modal-close-btn {
  background: none;
  border: none;
  color: var(--mt-text-light);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: var(--mt-transition);
}

.modal-close-btn:hover {
  color: var(--mt-text-main);
  background: var(--mt-white);
}

.date-records {
  padding: 1rem;
  max-height: 60vh;
  overflow-y: auto;
}

.empty-records {
  text-align: center;
  color: var(--mt-text-light);
  padding: 1rem;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--mt-white);
  border: 1px solid var(--mt-input-bg);
  padding: 0.75rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.record-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.record-emoji {
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(212, 165, 116, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
}

.record-details {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.record-name {
  font-weight: 700;
  color: var(--mt-text-main);
  font-size: 0.875rem;
  margin: 0;
}

.record-specs {
  font-size: 0.75rem;
  color: var(--mt-text-light);
  margin: 0;
}

.record-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.record-price {
  font-weight: 700;
  color: var(--mt-primary);
  font-size: 0.875rem;
}

.action-btn {
  padding: 0.375rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: var(--mt-transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn {
  color: #3B82F6;
  background: rgba(59, 130, 246, 0.1);
}

.edit-btn:hover {
  background: rgba(59, 130, 246, 0.2);
}

.delete-btn {
  color: var(--mt-error);
  background: rgba(255, 107, 107, 0.1);
}

.delete-btn:hover {
  background: rgba(255, 107, 107, 0.2);
}

.action-btn .icon {
  width: 1rem;
  height: 1rem;
}

.date-modal-footer {
  padding: 0.75rem 1.5rem;
  background: var(--mt-input-bg);
  border-top: 1px solid #E5E7EB;
  text-align: center;
}

.close-modal-btn {
  background: none;
  border: none;
  color: var(--mt-text-light);
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0.5rem;
  transition: var(--mt-transition);
}

.close-modal-btn:hover {
  color: var(--mt-text-main);
}

/* 响应式设计 */
@media (min-width: 768px) {
  .section-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }

  .month-title {
    font-size: 1.75rem;
  }
}

@media (max-width: 640px) {
  .add-record-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
}
</style>