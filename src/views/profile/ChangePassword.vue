<script setup>
import { reactive } from 'vue'
import { changePassword } from '../../api/auth'

const form = reactive({ oldPassword: '', newPassword: '' })
const loading = reactive({ value: false })
const message = reactive({ text: '' })

async function submit() {
  message.text = ''
  loading.value = true
  try {
    await changePassword({ oldPassword: form.oldPassword, newPassword: form.newPassword })
    message.text = '修改密码成功'
  } catch (e) {
    message.text = e.body && e.body.message ? e.body.message : (e.message || '修改失败')
  } finally { loading.value = false }
}
</script>

<template>
  <div class="change-password">
    <h3>修改密码</h3>
    <div v-if="message.text" class="msg">{{ message.text }}</div>
    <div>
      <label>旧密码</label>
      <input type="password" v-model="form.oldPassword" />
    </div>
    <div>
      <label>新密码</label>
      <input type="password" v-model="form.newPassword" />
    </div>
    <div style="margin-top:8px">
      <button @click.prevent="submit" :disabled="loading.value">提交</button>
    </div>
  </div>
</template>

<style scoped>
.msg { margin-bottom:8px }
label { display:block; margin-top:8px }
input { width:100%; padding:8px }
</style>
