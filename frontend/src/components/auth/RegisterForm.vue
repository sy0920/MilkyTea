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
    <h2>注册</h2>
    <div v-if="error.message" class="error">{{ error.message }}</div>

    <div class="form-group">
      <label>用户名 <span class="required">*</span></label>
      <input class="form-control" v-model="form.username" placeholder="至少3个字符" required />
    </div>

    <div class="form-group">
      <label>手机号 <span class="required">*</span></label>
      <input class="form-control" v-model="form.phone" type="tel" placeholder="请输入11位手机号" maxlength="11" required />
    </div>

    <div class="form-group">
      <label>昵称（可选）</label>
      <input class="form-control" v-model="form.nickname" placeholder="昵称" />
    </div>

    <div class="form-group">
      <label>密码 <span class="required">*</span></label>
      <input class="form-control" v-model="form.password" type="password" placeholder="至少6个字符" required />
    </div>

    <div class="actions">
      <button class="btn btn--primary" @click.prevent="submit" :disabled="loading.value">注册</button>
      <button class="btn btn--outline" @click.prevent="goBack">返回</button>
    </div>
  </div>
</template>

<style scoped>
.register-form { max-width: 520px; margin: 0 auto }
.error { color:#c00; margin-bottom:8px; padding: 8px; background: #fee; border-radius: 4px }
.required { color: #c00 }
.actions { display:flex; gap:12px; align-items:center; margin-top:12px }
</style>
