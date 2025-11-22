<script setup>
import { reactive } from 'vue'
import { changePassword } from '../../api/auth'

const form = reactive({ oldPassword: '', newPassword: '' })
const loading = reactive({ value: false })
const message = reactive({ text: '' })

async function submit() {
  message.text = ''
  
  if (!form.oldPassword) {
    message.text = '请输入旧密码'
    return
  }
  if (!form.newPassword || form.newPassword.length < 6 || form.newPassword.length > 25) {
    message.text = '新密码需要6-25个字符'
    return
  }
  if (!/[a-zA-Z]/.test(form.newPassword) || !/[0-9]/.test(form.newPassword)) {
    message.text = '新密码需包含字母和数字'
    return
  }

  loading.value = true
  try {
    await changePassword({ oldPassword: form.oldPassword, newPassword: form.newPassword })
    message.text = '修改密码成功'
    // 清空表单
    form.oldPassword = ''
    form.newPassword = ''
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
      <input type="password" v-model="form.oldPassword" placeholder="请输入当前密码" />
    </div>
    <div>
      <label>新密码</label>
      <input type="password" v-model="form.newPassword" placeholder="6-25字符，含字母数字" />
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
