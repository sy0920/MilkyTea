<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { register as apiRegister } from '../../api/auth'
import { setToken, setUser } from '../../utils/auth'

const router = useRouter()
const form = reactive({ username: '', phone: '', password: '', nickname: '' })
const loading = reactive({ value: false })
const error = reactive({ message: '' })

async function submit() {
  error.message = ''
  
  // 前端验证
  if (!form.username || form.username.trim().length < 3) {
    error.message = '用户名至少需要3个字符'
    return
  }
  if (!form.phone || form.phone.trim().length !== 11 || !/^1[3-9]\d{9}$/.test(form.phone.trim())) {
    error.message = '请输入11位有效的手机号'
    return
  }
  if (!form.password || form.password.length < 6) {
    error.message = '密码至少需要6个字符'
    return
  }
  
  loading.value = true
  try {
    const res = await apiRegister({
      username: form.username.trim(),
      phone: form.phone.trim(),
      password: form.password,
      nickname: form.nickname?.trim() || ''
    })
    if (res && res.token) {
      setToken(res.token)
      setUser({ id: res.userId, username: res.username, phone: res.phone })
      router.push('/home')
    }
  } catch (e) {
    // 显示友好的错误信息
    if (e.body && e.body.errors) {
      // 后端验证错误,提取字段错误
      const errors = e.body.errors
      const errorMessages = []
      if (errors.username) errorMessages.push('用户名: ' + errors.username)
      if (errors.phone) errorMessages.push('手机号: ' + errors.phone)
      if (errors.password) errorMessages.push('密码: ' + errors.password)
      error.message = errorMessages.length > 0 ? errorMessages.join('; ') : '注册信息有误,请检查后重试'
    } else {
      // 使用request.js处理过的友好错误消息
      error.message = e.message || '注册失败,请稍后重试'
    }
  } finally { loading.value = false }
}

function goBack() {
  router.push('/auth/login')
}
</script>

<template>
  <div class="register-form">
    <div v-if="error.message" class="error-msg">{{ error.message }}</div>

    <div class="form-group">
      <input 
        class="mt-input" 
        v-model="form.username" 
        placeholder="请输入用户名（至少3个字符）" 
        required 
      />
    </div>

    <div class="form-group">
      <input 
        class="mt-input" 
        v-model="form.phone" 
        type="tel" 
        placeholder="请输入手机号" 
        maxlength="11" 
        required 
      />
    </div>

    <!-- Nickname is optional and not in prototype, keeping it hidden or removed for now to match prototype strictly -->
    <!-- 
    <div class="form-group">
      <input class="mt-input" v-model="form.nickname" placeholder="昵称（可选）" />
    </div> 
    -->

    <div class="form-group">
      <input 
        class="mt-input" 
        v-model="form.password" 
        type="password" 
        placeholder="请输入密码（至少6个字符）" 
        required 
      />
    </div>

    <div class="actions">
      <button class="mt-btn btn-secondary" @click.prevent="goBack">返回</button>
      <button class="mt-btn btn-primary" @click.prevent="submit" :disabled="loading.value">
        <span v-if="loading.value">注册中...</span>
        <span v-else>立即注册</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.register-form { width: 100%; }
.error-msg { 
  color: var(--mt-error); 
  background: #FFF0F0;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: left;
}

.form-group { margin-bottom: 20px; }

.mt-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid transparent;
  background-color: var(--mt-input-bg);
  border-radius: var(--mt-radius);
  font-size: 16px;
  color: var(--mt-text-main);
  transition: var(--mt-transition);
  outline: none;
}

.mt-input:focus {
  background-color: var(--mt-white);
  border-color: var(--mt-primary);
  box-shadow: 0 0 0 4px rgba(212, 165, 116, 0.1);
}

.mt-input::placeholder {
  color: #A0A0A0;
}

.actions {
  margin-top: 30px;
  display: flex;
  gap: 15px;
  justify-content: space-between;
}

.mt-btn {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: var(--mt-radius);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--mt-transition);
}

.btn-primary {
  background-color: var(--mt-primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--mt-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 165, 116, 0.3);
}

.btn-secondary {
  background-color: transparent;
  border: 1px solid #E0E0E0;
  color: var(--mt-text-light);
}

.btn-secondary:hover {
  border-color: var(--mt-text-main);
  color: var(--mt-text-main);
  background-color: #FAFAFA;
}

.mt-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
