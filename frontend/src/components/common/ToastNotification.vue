<script setup>
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'success' // 'success' | 'error'
  }
})

const emit = defineEmits(['close'])

let timer = null

onMounted(() => {
  timer = setTimeout(() => {
    emit('close')
  }, 3000)
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <div
    class="toast"
    :class="{ 'toast-error': type === 'error', 'toast-success': type === 'success' }"
  >
    <div class="toast-icon">
      <svg v-if="type === 'error'" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <svg v-else class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m9 12 2 2 4-4"></path>
        <circle cx="12" cy="12" r="10"></circle>
      </svg>
    </div>
    <span class="toast-message">{{ message }}</span>
  </div>
</template>

<style scoped>
.toast {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.75rem 1rem;
  border-radius: 9999px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 60;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: toast-in 0.3s ease-out;
  font-weight: 500;
  font-size: 0.875rem;
  max-width: 90vw;
  word-break: break-all;
}

.toast-success {
  background-color: var(--mt-text-main);
  color: white;
}

.toast-error {
  background-color: var(--mt-error);
  color: white;
}

.icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-1rem);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>
