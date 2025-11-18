# MilkyTea - 奶茶消费记录与统计系统

一个基于 Spring Boot + React/Vue 的奶茶消费记录与统计系统，帮助用户追踪每日奶茶消费情况，提供消费统计和品牌偏好分析。

## 项目概述

### 核心功能
- 📝 **奶茶记录管理**: 记录每日奶茶消费详细信息（品牌、品类、甜度、冰度、价格、评分、评语）
- 📅 **日历视图**: 以日历形式直观展示每天的消费频率和详情
- 📊 **统计分析**: 提供基础统计、品牌偏好分析和消费趋势图表
- 👤 **用户系统**: 完整的用户注册、登录和个人信息管理功能
- 🔐 **安全认证**: 基于 JWT 的安全认证机制

## 项目结构

```
MilkyTea/
├── backend/          # Spring Boot 后端
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/milkytea/backend/
│   │   │   │       ├── config/          # 配置类
│   │   │   │       ├── controller/      # REST 控制器
│   │   │   │       ├── dto/             # 数据传输对象
│   │   │   │       ├── entity/          # 数据实体
│   │   │   │       ├── exception/       # 异常处理
│   │   │   │       ├── repository/      # 数据访问层
│   │   │   │       ├── security/        # 安全配置和JWT
│   │   │   │       └── service/         # 业务逻辑层
│   │   │   └── resources/
│   │   │       └── application.yml      # 应用配置
│   │   └── pom.xml                      # Maven 配置
│   └── API文档.md                        # 详细的API接口文档
└── frontend/         # React/Vue 前端（待开发）
```

## 功能特性

### 已实现功能

✅ **用户认证系统**
- 用户注册（用户名、邮箱、密码）
- 用户登录
- JWT Token 认证
- 密码加密存储（BCrypt）

✅ **个人信息管理**
- 获取用户信息
- 更新个人资料（昵称、邮箱、手机、头像）
- 修改密码

✅ **品牌管理**
- 创建奶茶品牌
- 获取品牌列表和详情
- 删除品牌

✅ **奶茶记录管理**
- 添加消费记录（品牌、品类、甜度、冰度、价格、评分、评语）
- 编辑记录
- 删除记录
- 查看记录详情

✅ **统计分析**
- 基础统计（总杯数、消费天数、累计金额、平均价格等）
- 品牌统计（各品牌消费数量、金额、评分）
- 日历视图（月度消费数据展示）

✅ **安全特性**
- JWT Token 认证
- CORS 跨域支持
- 全局异常处理
- 输入验证

✅ **API 文档**
- Swagger UI 交互式文档
- 详细的 Markdown 文档

## 技术栈

### 后端
- **框架**: Spring Boot 2.7.18
- **Java 版本**: Java 8
- **数据库**: H2 Database (开发环境)
- **安全**: Spring Security + JWT
- **ORM**: Spring Data JPA + Hibernate
- **API 文档**: SpringDoc OpenAPI 3.0
- **构建工具**: Maven

### 前端（计划）
- React 或 Vue.js
- Axios (HTTP 客户端)
- React Router / Vue Router
- Ant Design / Element UI

## 快速开始

### 前置要求

- JDK 8 或更高版本
- Maven 3.6+

### 启动后端

1. **克隆项目**
```bash
git clone https://github.com/sy0920/MilkyTea.git
cd MilkyTea
```

2. **进入后端目录**
```bash
cd backend
```

3. **构建项目**
```bash
mvn clean install
```

4. **启动应用**
```bash
mvn spring-boot:run
```

应用将在 `http://localhost:8080` 启动

### 访问服务

- **API 基础 URL**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **H2 控制台**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:milkytea`
  - 用户名: `sa`
  - 密码: (留空)

## API 接口

### 认证接口

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| POST | `/api/auth/register` | 用户注册 | ❌ |
| POST | `/api/auth/login` | 用户登录 | ❌ |

### 用户接口

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| GET | `/api/user/profile` | 获取用户信息 | ✅ |
| PUT | `/api/user/profile` | 更新用户信息 | ✅ |
| POST | `/api/user/change-password` | 修改密码 | ✅ |

### 品牌接口

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| GET | `/api/brands` | 获取所有品牌 | ❌ |
| GET | `/api/brands/{id}` | 获取品牌详情 | ❌ |
| POST | `/api/brands` | 创建品牌 | ✅ |
| DELETE | `/api/brands/{id}` | 删除品牌 | ✅ |

### 记录接口

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| POST | `/api/records` | 创建记录 | ✅ |
| GET | `/api/records` | 获取记录列表 | ✅ |
| GET | `/api/records/{id}` | 获取记录详情 | ✅ |
| PUT | `/api/records/{id}` | 更新记录 | ✅ |
| DELETE | `/api/records/{id}` | 删除记录 | ✅ |

### 统计接口

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| GET | `/api/statistics/summary` | 获取基础统计 | ✅ |
| GET | `/api/statistics/brands` | 获取品牌统计 | ✅ |
| GET | `/api/statistics/calendar/{year}/{month}` | 获取日历月度数据 | ✅ |

详细的 API 文档请查看: [API文档.md](backend/API文档.md)

## 使用示例

### 注册用户
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123456",
    "nickname": "测试用户"
  }'
```

### 登录
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123456"
  }'
```

### 获取用户信息
```bash
curl -X GET http://localhost:8080/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 配置说明

### application.yml

```yaml
server:
  port: 8080                    # 服务器端口

spring:
  datasource:
    url: jdbc:h2:mem:milkytea   # 数据库连接（H2内存数据库）
  
app:
  jwt:
    secret: "your-secret-key"   # JWT 密钥（生产环境请更改）
    expirationMs: 604800000     # Token 过期时间（7天）
```

## 开发计划

### 后端改进
- [ ] 添加单元测试
- [ ] 添加集成测试
- [ ] 支持邮箱验证
- [ ] 支持找回密码
- [ ] 添加用户角色和权限
- [ ] 集成 MySQL/PostgreSQL
- [ ] 添加日志记录
- [ ] 添加 Redis 缓存

### 前端开发
- [ ] 创建 React/Vue 项目
- [ ] 实现注册页面
- [ ] 实现登录页面
- [ ] 实现个人信息面板
- [ ] 实现密码修改功能
- [ ] 添加表单验证
- [ ] 优化 UI/UX

## 注意事项

⚠️ **开发环境配置**
- 当前使用 H2 内存数据库，重启后数据会丢失
- JWT 密钥使用默认值，生产环境请修改
- CORS 配置允许所有来源，生产环境请限制

⚠️ **生产环境部署前**
1. 修改 JWT 密钥
2. 配置真实数据库（MySQL/PostgreSQL）
3. 限制 CORS 允许的来源
4. 启用 HTTPS
5. 配置日志记录
6. 添加监控和告警

## 项目状态

🟢 **后端**: 已完成基础功能  
🔵 **前端**: 待开发  
🟡 **测试**: 待添加  
🟡 **部署**: 待配置

## 贡献

欢迎提交 Issue 和 Pull Request!

## 许可证

MIT License

## 联系方式

- GitHub: [@sy0920](https://github.com/sy0920)
- 项目链接: https://github.com/sy0920/MilkyTea

今天你喝奶茶了吗
