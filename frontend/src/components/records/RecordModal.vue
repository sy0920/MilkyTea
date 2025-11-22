<script setup>
import { watch, ref } from 'vue'
import RecordForm from './RecordForm.vue'

const props = defineProps({
  isOpen: Boolean,
  initialData: Object,
  availableBrands: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'save', 'addBrand'])

const formRef = ref(null)

const handleSave = (recordData) => {
  emit('save', recordData)
}

const handleAddBrand = (brandName) => {
  emit('addBrand', brandName)
}

const handleClose = () => {
  emit('close')
}

// 当模态框关闭时重置表单
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen && formRef.value) {
    // 表单重置逻辑在RecordForm组件内部处理
  }
})
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click="handleClose">
    <div class="modal-content" @click.stop>
      <!-- 模态框头部 -->
      <div class="modal-header">
        <h3 class="modal-title">{{ initialData ? '编辑记录' : '记一杯' }}</h3>
        <button @click="handleClose" class="close-btn">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- 表单内容 -->
      <RecordForm
        ref="formRef"
        :initial-data="initialData"
        :available-brands="availableBrands"
        @save="handleSave"
        @add-brand="handleAddBrand"
      />
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-content {
  background: var(--mt-white);
  border-radius: 1rem;
  width: 100%;
  max-width: 28rem;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: modal-in 0.3s ease-out;
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-1rem);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--mt-input-bg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: var(--mt-white);
  z-index: 10;
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--mt-text-main);
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  border-radius: 0.25rem;
  color: var(--mt-text-light);
  transition: var(--mt-transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: var(--mt-text-main);
  background-color: var(--mt-input-bg);
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .modal-content {
    max-width: 95vw;
    margin: 1rem;
  }

  .modal-header {
    padding: 1rem;
  }
}
</style>
