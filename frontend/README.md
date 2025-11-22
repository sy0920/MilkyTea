# MilkyTea Frontend - 奶茶消费记录与统计系统

一个基于 Vue 3 + Vite 的现代化奶茶消费记录与统计前端应用。

## 项目概述

这是 MilkyTea 系统的前端部分，提供了一个美观易用的用户界面来记录和分析奶茶消费情况。

### 核心功能
- 📝 **奶茶记录管理**: 添加、编辑、删除奶茶消费记录
- 📅 **日历视图**: 直观展示每日消费情况
- 📊 **统计分析**: 消费趋势、品牌偏好分析
- 👤 **用户系统**: 注册、登录、个人信息管理
- 🏷️ **品牌管理**: 自定义品牌管理

### 技术特性
- ✅ Vue 3 组合式API
- ✅ 响应式设计（移动端友好）
- ✅ 现代化UI设计
- ✅ JWT认证
- ✅ API集成
- ✅ 状态管理
- ✅ 路由导航

## 技术栈

- **框架**: Vue 3
- **构建工具**: Vite
- **路由**: Vue Router 4
- **HTTP客户端**: Axios
- **样式**: CSS3 + CSS Variables
- **图标**: Lucide Icons (SVG)
- **开发工具**: ESLint, Prettier

## 项目结构

```
frontend/
├── public/
│   ├── default-avatar.svg         # 默认头像
│   └── favicon.ico
├── src/
│   ├── api/                       # API接口
│   │   ├── auth.js               # 认证API
│   │   ├── user.js               # 用户API
│   │   ├── brands.js             # 品牌API
│   │   ├── records.js            # 记录API
│   │   ├── statistics.js         # 统计API
│   │   └── index.js              # API统一导出
│   ├── assets/                   # 静态资源
│   │   ├── base.css              # 基础样式
│   │   ├── main.css              # 主样式
│   │   └── styles/               # 样式模块
│   │       ├── global.scss       # 全局样式
│   │       ├── mixin.css         # 混入
│   │       └── variable.css      # CSS变量
│   ├── components/               # 组件
│   │   ├── auth/                 # 认证组件
│   │   │   ├── LoginForm.vue
│   │   │   └── RegisterForm.vue
│   │   ├── common/               # 通用组件
│   │   │   ├── AppLayout.vue     # 应用布局
│   │   │   ├── ProfileModal.vue  # 用户设置弹窗
│   │   │   └── ToastNotification.vue # 消息提示
│   │   ├── records/              # 记录组件
│   │   │   ├── RecordForm.vue    # 记录表单
│   │   │   └── RecordModal.vue   # 记录弹窗
│   │   └── statistics/           # 统计组件
│   │       ├── CalendarView.vue  # 日历视图
│   │       └── StatsSummary.vue  # 统计摘要
│   ├── router/                   # 路由配置
│   │   └── index.js
│   ├── store/                    # 状态管理
│   │   └── index.js
│   ├── utils/                    # 工具函数
│   │   ├── auth.js               # 认证工具
│   │   ├── constants.js          # 常量定义
│   │   ├── date.js               # 日期处理
│   │   ├── request.js            # HTTP请求配置
│   │   └── validation.js         # 表单验证
│   ├── views/                    # 页面组件
│   │   ├── auth/                 # 认证页面
│   │   │   ├── Login.vue
│   │   │   └── Register.vue
│   │   ├── dashboard/            # 主要功能页面
│   │   │   └── Dashboard.vue
│   │   ├── profile/              # 个人中心
│   │   │   └── Profile.vue
│   │   └── statistics/           # 统计页面
│   ├── App.vue                   # 根组件
│   └── main.js                   # 入口文件
├── docs/                         # 文档
├── package.json
├── vite.config.js                # Vite配置
└── README.md
```

## API集成

本项目完全集成后端API接口：

### 基础配置
- **Base URL**: `http://localhost:8080`
- **认证方式**: JWT Bearer Token
- **请求格式**: JSON

### 主要接口模块

#### 认证接口 (/api/auth)
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

#### 用户接口 (/api/user) 🔒
- `GET /api/user/profile` - 获取用户信息
- `PUT /api/user/profile` - 更新用户信息
- `PATCH /api/user/username` - 修改用户名
- `POST /api/user/change-password` - 修改密码

#### 品牌接口 (/api/brands)
- `GET /api/brands` - 获取品牌列表
- `GET /api/brands/{id}` - 获取品牌详情
- `POST /api/brands` - 创建品牌 🔒
- `DELETE /api/brands/{id}` - 删除品牌 🔒

#### 记录接口 (/api/records) 🔒
- `POST /api/records` - 创建记录
- `GET /api/records` - 获取记录列表
- `GET /api/records/{id}` - 获取记录详情
- `PUT /api/records/{id}` - 更新记录
- `DELETE /api/records/{id}` - 删除记录

#### 统计接口 (/api/statistics) 🔒
- `GET /api/statistics/summary` - 基础统计
- `GET /api/statistics/brands` - 品牌统计
- `GET /api/statistics/trends` - 趋势分析
- `GET /api/statistics/calendar/{year}/{month}` - 日历数据

🔒 = 需要认证

## 快速开始

### 环境要求

- Node.js 16.0+ 
- npm 7.0+

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动

### 生产构建

```bash
npm run build
```

## 功能演示

### 1. 用户认证
- **注册**: 用户名、手机号、密码注册
- **登录**: 手机号/用户名 + 密码登录
- **JWT**: 自动token管理，7天有效期

### 2. 奶茶记录
- **添加记录**: 选择品牌、填写品类、甜度、冰度、价格、评分、评语
- **编辑记录**: 修改已有记录的任何信息
- **删除记录**: 快速删除不需要的记录

### 3. 日历视图
- **月度视图**: 按月查看每日消费情况
- **消费标记**: 有消费的日期显示奶茶图标和金额
- **详情查看**: 点击日期查看当日详细记录

### 4. 统计分析
- **基础统计**: 总杯数、消费天数、累计金额、平均价格等
- **品牌偏好**: 各品牌消费占比和排行
- **趋势分析**: 消费频率和金额变化趋势

### 5. 个人设置
- **用户信息**: 修改用户名、手机号、头像
- **密码修改**: 安全的密码更新机制
- **账户管理**: 登出等操作

## 设计特色

### 🎨 视觉设计
- **奶茶主题**: 温暖的奶茶色彩搭配
- **现代化UI**: 圆角、阴影、渐变等现代设计元素
- **动画效果**: 流畅的交互动画和过渡效果

### 📱 响应式设计
- **桌面端**: 侧边栏导航 + 主内容区布局
- **移动端**: 顶部导航 + 底部标签栏布局
- **自适应**: 各种屏幕尺寸完美适配

### 🚀 性能优化
- **懒加载**: 组件按需加载
- **缓存策略**: API请求缓存优化
- **体验优化**: 加载状态、错误处理、消息提示

## 开发指南

### 代码规范
- Vue 3 组合式API
- TypeScript风格的JSDoc注释
- ESLint代码规范检查
- 统一的命名约定

### 组件开发
```vue
<script setup>
import { reactive, computed, onMounted } from 'vue'

// 组件逻辑
</script>

<template>
  <!-- 模板 -->
</template>

<style scoped>
/* 样式 */
</style>
```

### API调用示例
```javascript
import { getRecords, createRecord } from '@/api/records'

// 获取记录
const records = await getRecords({
  startDate: '2025-11-01',
  endDate: '2025-11-30'
})

// 创建记录
const newRecord = await createRecord({
  brandId: 1,
  category: '波霸奶茶',
  sweetness: '半糖',
  iceLevel: '少冰',
  price: 18.00,
  rating: 8
})
```

## 部署说明

### 环境变量
```bash
# .env.production
VITE_API_BASE_URL=https://your-api-domain.com
```

### 构建部署
```bash
# 构建
npm run build

# 部署dist目录到Web服务器
```

## 更新日志

### v1.0.0 (2025-11-22)
- ✅ 完整的React到Vue转换
- ✅ 所有API接口集成
- ✅ 响应式设计实现
- ✅ 用户认证系统
- ✅ 奶茶记录管理
- ✅ 统计分析功能
- ✅ 移除预算管理功能

## 后续计划

- [ ] 添加更多图表类型
- [ ] 支持数据导出功能
- [ ] 添加消费提醒功能
- [ ] 支持多语言
- [ ] 添加深色模式
- [ ] 性能优化和PWA支持

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

---

*今天你喝奶茶了吗？* ☕
