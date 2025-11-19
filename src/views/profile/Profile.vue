<script setup>
import { ref, onMounted } from 'vue'
import store from '../../store'
import { updateProfile } from '../../api/auth'
import { getUser, setUser } from '../../utils/auth'

const loading = ref(false)
const success = ref('')
const error = ref('')
const user = ref(store.state.user || { username: '', email: '', nickname: '', phone: '', avatar: '' })

onMounted(async () => {
  if (!store.state.user) {
    loading.value = true
    try {
        const p = await store.actions.fetchProfile()
        user.value = p
        // sync localStorage
        setUser(p)
    } catch (e) {
      error.value = e.message || '获取用户信息失败'
    } finally { loading.value = false }
  } else {
    user.value = store.state.user
  }
})

async function save() {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    const updated = await updateProfile({ nickname: user.value.nickname, email: user.value.email, phone: user.value.phone, avatar: user.value.avatar })
    user.value = updated
    success.value = '保存成功'
  } catch (e) {
    error.value = e.body && e.body.message ? e.body.message : (e.message || '保存失败')
  } finally { loading.value = false }
}
</script>

<template>
  <div class="container">
    <div class="card profile-page">
      <h2>个人信息</h2>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="success" class="success">{{ success }}</div>
      <div>
        <label>用户名</label>
        <input :value="user.username" disabled />
      </div>
      <div>
        <label>昵称</label>
        <input v-model="user.nickname" />
      </div>
      <div>
        <label>邮箱</label>
        <input v-model="user.email" />
      </div>
      <div>
        <label>手机号</label>
        <input v-model="user.phone" />
      </div>
      <div>
        <label>头像 URL</label>
        <input v-model="user.avatar" />
      </div>
      <div style="margin-top:12px">
        <button @click.prevent="save" :disabled="loading">保存</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page { max-width: 700px }
.profile-page label { display:block; margin:8px 0 4px }
.profile-page input { width:100%; padding:8px }
.error { color:#c00 }
.success { color:#0a0 }
</style>
