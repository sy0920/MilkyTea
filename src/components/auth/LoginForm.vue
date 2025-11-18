<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { login as apiLogin } from '../../api/auth'
import { setToken, setUser } from '../../utils/auth'

const router = useRouter()
const form = reactive({ username: '', password: '' })
const loading = reactive({ value: false })
const error = reactive({ message: '' })

async function submit() {
  error.message = ''
  loading.value = true
  try {
    const res = await apiLogin({ username: form.username, password: form.password })
    if (res && res.token) {
      setToken(res.token)
      setUser({ id: res.userId, username: res.username, email: res.email })
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
    <div>
      <label>用户名</label>
      <input v-model="form.username" placeholder="用户名或邮箱" />
    </div>
    <div>
      <label>密码</label>
      <input v-model="form.password" type="password" placeholder="密码" />
    </div>
    <div class="actions">
      <button class="btn-primary" @click.prevent="submit" :disabled="loading.value">登录</button>
      <div class="meta">
        <span>没有账号？</span>
        <router-link to="/auth/register" style="margin-left:6px">注册账号</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-form { max-width: 420px; margin: 0 auto; background: #fff; padding:20px; border-radius:8px; box-shadow: 0 6px 18px rgba(22,32,51,0.06) }
.login-form label { display:block; margin:8px 0 4px }
.login-form input { width:100%; padding:10px; border:1px solid #e2e8f0; border-radius:6px }
.error { color: #c00; margin-bottom:8px }
.login-form h2 { margin: 0 0 12px }
.meta { font-size: 13px; color: #555 }
.actions { display:flex; gap:12px; align-items:center; margin-top:12px; justify-content:space-between }
.btn-primary { background:#38a169; color:#fff; border:none; padding:8px 14px; border-radius:6px; cursor:pointer }
.btn-primary[disabled] { opacity:0.6; cursor:not-allowed }
</style>
