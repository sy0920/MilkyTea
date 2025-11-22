<script setup>
import { computed } from 'vue'

const props = defineProps({
  user: Object,
  currentTab: String
})

const emit = defineEmits(['tabChange', 'showProfile', 'logout'])

const userInitial = computed(() => {
  return props.user?.username ? props.user.username[0].toUpperCase() : 'U'
})

const handleTabChange = (tabId) => {
  emit('tabChange', tabId)
}

const handleShowProfile = () => {
  emit('showProfile')
}

const handleLogout = () => {
  emit('logout')
}

const navigationItems = [
  { id: 'calendar', label: '日历视图', icon: 'calendar' },
  { id: 'stats', label: '统计报表', icon: 'chart' }
]
</script>

<template>
  <div class="app-layout">
    <!-- 桌面端侧边栏 -->
    <div class="desktop-sidebar">
      <!-- Logo区域 -->
      <div class="sidebar-header">
        <div class="logo-icon">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 3v18l7-2 7 2V3H5zm7 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
          </svg>
        </div>
        <span class="logo-text">Bobalog</span>
      </div>

      <!-- 导航菜单 -->
      <nav class="sidebar-nav">
        <button
          v-for="item in navigationItems"
          :key="item.id"
          @click="handleTabChange(item.id)"
          :class="['nav-item', { 'nav-active': currentTab === item.id }]"
        >
          <!-- 日历图标 -->
          <svg v-if="item.icon === 'calendar'" class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>

          <!-- 图表图标 -->
          <svg v-else-if="item.icon === 'chart'" class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12c-1.3 0-2.5-.3-3.5-.8-.9-.5-1.9-1.2-2.5-2-.6.8-1.6 1.5-2.5 2-.9.5-2.1.8-3.5.8s-2.5-.3-3.5-.8C4.1 10.7 3.1 10 2.5 9.2"></path>
            <path d="M21 21v-7"></path>
            <path d="M12 21v-7"></path>
            <path d="M3 21v-7"></path>
          </svg>

          <span class="nav-label">{{ item.label }}</span>
        </button>
      </nav>

      <!-- 用户信息 -->
      <div class="sidebar-footer">
        <button @click="handleShowProfile" class="user-profile">
          <div class="user-avatar">
            {{ userInitial }}
          </div>
          <div class="user-info">
            <p class="user-name">{{ user?.username || '用户' }}</p>
            <p class="user-meta">个人设置</p>
          </div>
        </button>
      </div>
    </div>

    <!-- 移动端头部 -->
    <div class="mobile-header">
      <div class="mobile-logo">
        <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 3v18l7-2 7 2V3H5zm7 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
        </svg>
        <span class="mobile-logo-text">Bobalog</span>
      </div>
      <button @click="handleShowProfile" class="mobile-profile-btn">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </button>
    </div>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <slot />
    </main>

    <!-- 移动端底部导航 -->
    <div class="mobile-bottom-nav">
      <button
        @click="handleTabChange('calendar')"
        :class="['mobile-nav-item', { 'mobile-nav-active': currentTab === 'calendar' }]"
      >
        <svg class="mobile-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span class="mobile-nav-label">日历</span>
      </button>

      <button
        @click="handleTabChange('add')"
        class="mobile-add-btn"
      >
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>

      <button
        @click="handleTabChange('stats')"
        :class="['mobile-nav-item', { 'mobile-nav-active': currentTab === 'stats' }]"
      >
        <svg class="mobile-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12c-1.3 0-2.5-.3-3.5-.8-.9-.5-1.9-1.2-2.5-2-.6.8-1.6 1.5-2.5 2-.9.5-2.1.8-3.5.8s-2.5-.3-3.5-.8C4.1 10.7 3.1 10 2.5 9.2"></path>
          <path d="M21 21v-7"></path>
          <path d="M12 21v-7"></path>
          <path d="M3 21v-7"></path>
        </svg>
        <span class="mobile-nav-label">统计</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  background: var(--mt-secondary);
  padding-bottom: 5rem; /* 为移动端底部导航留空间 */
  display: flex;
  flex-direction: column;
}

/* 桌面端侧边栏 */
.desktop-sidebar {
  display: none;
  position: fixed;
  left: 0;
  top: 0;
  width: 16rem;
  height: 100vh;
  background: var(--mt-white);
  border-right: 1px solid #E5E7EB;
  flex-direction: column;
  z-index: 20;
}

.sidebar-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid var(--mt-input-bg);
}

.logo-icon {
  background: rgba(212, 165, 116, 0.1);
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: var(--mt-primary);
}

.logo-text {
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--mt-text-main);
}

.sidebar-nav {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: var(--mt-transition);
  text-align: left;
  color: var(--mt-text-light);
}

.nav-item:hover {
  background: var(--mt-input-bg);
}

.nav-active {
  background: rgba(212, 165, 116, 0.1);
  color: var(--mt-primary);
  font-weight: 500;
}

.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.nav-label {
  font-size: 0.875rem;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--mt-input-bg);
}

.user-profile {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: var(--mt-transition);
  text-align: left;
}

.user-profile:hover {
  background: var(--mt-input-bg);
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  background: rgba(212, 165, 116, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--mt-accent);
  font-weight: 700;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  overflow: hidden;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--mt-text-main);
  margin: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.user-meta {
  font-size: 0.75rem;
  color: var(--mt-text-light);
  margin: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

/* 移动端头部 */
.mobile-header {
  display: flex;
  background: var(--mt-white);
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 20;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  justify-content: space-between;
  align-items: center;
}

.mobile-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--mt-primary);
}

.mobile-logo-text {
  font-weight: 700;
  font-size: 1.125rem;
  color: var(--mt-text-main);
}

.mobile-profile-btn {
  background: rgba(212, 165, 116, 0.1);
  border: none;
  padding: 0.5rem;
  border-radius: 50%;
  color: var(--mt-primary);
  cursor: pointer;
  transition: var(--mt-transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-profile-btn:hover {
  background: rgba(212, 165, 116, 0.2);
}

/* 主内容区 */
.main-content {
  flex: 1;
  padding: 1rem;
  max-width: 6xl;
  margin: 0 auto;
  width: 100%;
}

/* 移动端底部导航 */
.mobile-bottom-nav {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--mt-white);
  border-top: 1px solid #E5E7EB;
  justify-content: space-around;
  padding: 0.75rem;
  z-index: 20;
}

.mobile-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: var(--mt-transition);
  color: var(--mt-text-light);
}

.mobile-nav-active {
  color: var(--mt-primary);
}

.mobile-nav-icon {
  width: 1.375rem;
  height: 1.375rem;
}

.mobile-nav-label {
  font-size: 0.75rem;
}

.mobile-add-btn {
  background: var(--mt-primary);
  color: var(--mt-white);
  border: none;
  padding: 0.75rem;
  border-radius: 50%;
  cursor: pointer;
  transition: var(--mt-transition);
  box-shadow: 0 4px 12px rgba(212, 165, 116, 0.3);
  margin-top: -2rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-add-btn:hover {
  background: var(--mt-primary-dark);
  transform: translateY(-1px);
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
}

/* 桌面端样式 */
@media (min-width: 768px) {
  .app-layout {
    padding-bottom: 0;
    flex-direction: row;
  }

  .desktop-sidebar {
    display: flex;
  }

  .mobile-header {
    display: none;
  }

  .mobile-bottom-nav {
    display: none;
  }

  .main-content {
    margin-left: 16rem;
    padding: 2rem;
  }
}
</style>
