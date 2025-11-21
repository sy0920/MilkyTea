<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { login as apiLogin } from '../../api/auth'
import { setToken, setUser } from '../../utils/auth'

const router = useRouter()
const form = reactive({ phone: '', password: '' })
const loading = reactive({ value: false })
const error = reactive({ message: '' })

async function submit() {
  error.message = ''
  
  // 前端验证
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
    const res = await apiLogin({ phone: form.phone.trim(), password: form.password })
    if (res && res.token) {
      setToken(res.token)
      setUser({ id: res.userId, username: res.username, phone: res.phone })
      const redirect = router.currentRoute.value.query.redirect || '/home'
      router.push(redirect)
    }
  } catch (e) {
    error.message = e.message || '登录失败'
  } finally { loading.value = false }
}
</script>

<template>
  <div class="login-form">
    <div v-if="error.message" class="error-msg">{{ error.message }}</div>

    <div class="form-group">
      <input 
        class="mt-input" 
        v-model="form.phone" 
        type="tel" 
        placeholder="请输入手机号" 
        maxlength="11" 
      />
    </div>

    <div class="form-group">
      <input 
        class="mt-input" 
        v-model="form.password" 
        type="password" 
        placeholder="请输入密码" 
      />
    </div>

    <div class="actions">
      <div class="meta">
        <span>没有账号？</span>
        <router-link to="/auth/register" class="link">立即注册</router-link>
      </div>
      <button class="mt-btn" @click.prevent="submit" :disabled="loading.value">
        <span v-if="loading.value">登录中...</span>
        <span v-else>登录</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.login-form { width: 100%; }
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
  flex-direction: column;
  gap: 20px;
}

.mt-btn {
  width: 100%;
  padding: 14px;
  background-color: var(--mt-primary);
  color: white;
  border: none;
  border-radius: var(--mt-radius);
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--mt-transition);
}

.mt-btn:hover:not(:disabled) {
  background-color: var(--mt-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 165, 116, 0.3);
}

.mt-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.meta {
  font-size: 14px;
  color: var(--mt-text-light);
  display: flex;
  justify-content: center;
  gap: 5px;
}

.link {
  color: var(--mt-accent);
  font-weight: 600;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
</style>
