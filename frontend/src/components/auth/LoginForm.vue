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
    <h2>登录</h2>
    <div v-if="error.message" class="error">{{ error.message }}</div>

    <div class="form-group">
      <label>手机号</label>
      <input class="form-control" v-model="form.phone" type="tel" placeholder="请输入11位手机号" maxlength="11" />
    </div>

    <div class="form-group">
      <label>密码</label>
      <input class="form-control" v-model="form.password" type="password" placeholder="密码" />
    </div>

    <div class="actions">
      <button class="btn btn--primary" @click.prevent="submit" :disabled="loading.value">登录</button>
      <div class="meta">
        <span>没有账号？</span>
        <router-link to="/auth/register" style="margin-left:6px">注册账号</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-form { max-width: 420px; margin: 0 auto }
.error { color: #c00; margin-bottom:8px }
.login-form h2 { margin: 0 0 12px }
.meta { font-size: 13px; color: #555 }
.actions { display:flex; gap:12px; align-items:center; margin-top:12px; justify-content:space-between }
</style>
