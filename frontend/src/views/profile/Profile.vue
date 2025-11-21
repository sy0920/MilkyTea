<script setup>
import { ref, onMounted, computed } from 'vue'
import store from '../../store'
import { updateProfile } from '../../api/auth'
import { getUser, setUser } from '../../utils/auth'

const loading = ref(false)
const success = ref('')
const error = ref('')
const user = ref(store.state.user || { username: '', phone: '', avatar: '' })
const fileInput = ref(null)
const uploadedImage = ref('')

const avatarUrl = computed(() => {
  if (uploadedImage.value) return uploadedImage.value
  if (user.value.avatar) return user.value.avatar
  return '/default-avatar.svg'
})

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

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileChange(event) {
  const file = event.target.files?.[0]
  if (!file) return
  
  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    error.value = '请选择图片文件'
    return
  }
  
  // 验证文件大小 (限制为 2MB)
  if (file.size > 2 * 1024 * 1024) {
    error.value = '图片大小不能超过 2MB'
    return
  }
  
  // 读取文件并转换为 Base64
  const reader = new FileReader()
  reader.onload = (e) => {
    uploadedImage.value = e.target.result
    user.value.avatar = e.target.result
    error.value = ''
  }
  reader.onerror = () => {
    error.value = '读取图片失败'
  }
  reader.readAsDataURL(file)
}

function removeAvatar() {
  uploadedImage.value = ''
  user.value.avatar = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

async function save() {
  error.value = ''
  success.value = ''
  loading.value = true
  try {
    const updated = await updateProfile({ phone: user.value.phone, avatar: user.value.avatar })
    user.value = updated
    success.value = '保存成功'
  } catch (e) {
    // 使用友好的错误消息
    error.value = e.message || '保存失败,请稍后重试'
  } finally { loading.value = false }
}
</script>

<template>
  <div class="container">
    <div class="card profile-page">
      <h2>个人信息</h2>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="success" class="success">{{ success }}</div>
      
      <!-- 头像区域 -->
      <div class="avatar-section">
        <div class="avatar-preview">
          <img :src="avatarUrl" alt="头像" />
        </div>
        <div class="avatar-actions">
          <input 
            ref="fileInput"
            type="file" 
            accept="image/*" 
            @change="handleFileChange"
            style="display: none"
          />
          <button type="button" @click="triggerFileInput" class="btn-upload">
            上传头像
          </button>
          <button 
            type="button" 
            @click="removeAvatar" 
            class="btn-remove"
            v-if="user.avatar"
          >
            使用默认头像
          </button>
          <div class="avatar-hint">支持 JPG、PNG、GIF，不超过 2MB</div>
        </div>
      </div>

      <div class="form-group">
        <label>用户名</label>
        <input :value="user.username" disabled />
      </div>
      <div class="form-group">
        <label>手机号</label>
        <input v-model="user.phone" type="tel" placeholder="请输入11位手机号" maxlength="11" disabled />
      </div>
      <div style="margin-top:20px">
        <button @click.prevent="save" :disabled="loading" class="btn-save">
          {{ loading ? '保存中...' : '保存' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page { 
  max-width: 700px;
  padding: 24px;
}

.profile-page h2 {
  margin-bottom: 20px;
  color: #333;
}

.error { 
  color: #c00;
  background: #fee;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.success { 
  color: #0a0;
  background: #efe;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.avatar-section {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e0e0e0;
}

.avatar-preview {
  flex-shrink: 0;
}

.avatar-preview img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.avatar-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 20px;
}

.btn-upload, .btn-remove {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-upload {
  background: #4CAF50;
  color: white;
}

.btn-upload:hover {
  background: #45a049;
}

.btn-remove {
  background: #f44336;
  color: white;
}

.btn-remove:hover {
  background: #da190b;
}

.avatar-hint {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label { 
  display: block;
  margin-bottom: 6px;
  color: #555;
  font-weight: 500;
}

.form-group input { 
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #4CAF50;
}

.form-group input:disabled {
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.btn-save {
  padding: 10px 24px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-save:hover:not(:disabled) {
  background: #0b7dda;
}

.btn-save:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
