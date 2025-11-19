<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { register as apiRegister } from '../../api/auth'
import { setToken, setUser } from '../../utils/auth'

const router = useRouter()
const form = reactive({ username: '', email: '', password: '', nickname: '' })
const loading = reactive({ value: false })
const error = reactive({ message: '' })

async function submit() {
  error.message = ''
  loading.value = true
  try {
    const res = await apiRegister({
      username: form.username,
      email: form.email,
      password: form.password,
      nickname: form.nickname
    })
    if (res && res.token) {
      setToken(res.token)
      setUser({ id: res.userId, username: res.username, email: res.email })
      router.push('/home')
    }
  } catch (e) {
    error.message = e.body && e.body.message ? e.body.message : (e.message || '注册失败')
  } finally { loading.value = false }
}

function goBack() {
  router.push('/auth/login')
}
</script>

<template>
  <div class="register-form">
    <h2>注册</h2>
    <div v-if="error.message" class="error">{{ error.message }}</div>

    <div class="form-group">
      <label>用户名</label>
      <input class="form-control" v-model="form.username" placeholder="用户名" />
    </div>

    <div class="form-group">
      <label>邮箱</label>
      <input class="form-control" v-model="form.email" placeholder="邮箱" />
    </div>

    <div class="form-group">
      <label>昵称（可选）</label>
      <input class="form-control" v-model="form.nickname" placeholder="昵称" />
    </div>

    <div class="form-group">
      <label>密码</label>
      <input class="form-control" v-model="form.password" type="password" placeholder="密码" />
    </div>

    <div class="actions">
      <button class="btn btn--primary" @click.prevent="submit" :disabled="loading.value">注册</button>
      <button class="btn btn--outline" @click.prevent="goBack">返回</button>
    </div>
  </div>
</template>

<style scoped>
.register-form { max-width: 520px; margin: 0 auto }
.error { color:#c00; margin-bottom:8px }
.actions { display:flex; gap:12px; align-items:center; margin-top:12px }
</style>
