<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSummary } from '../../api/statistics'

function formatDate(d) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const router = useRouter()
const period = ref(30)
const loading = ref(false)
const error = ref('')
const stats = ref({ totalCups: 0, totalDays: 0, totalAmount: 0.0 })

async function load() {
  error.value = ''
  loading.value = true
  try {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - (period.value - 1))
    const data = await getSummary({ startDate: formatDate(start), endDate: formatDate(end) })
    stats.value.totalCups = data.totalCups ?? 0
    stats.value.totalDays = data.totalDays ?? 0
    stats.value.totalAmount = data.totalAmount ?? 0
  } catch (e) {
    error.value = e.message || '获取统计失败'
  } finally { loading.value = false }
}

onMounted(() => load())

function changePeriod(v) { period.value = v; load() }
</script>

<template>
  <div class="container">
    <div class="card basic-stats">
      <div class="controls">
        <label>统计周期：</label>
        <button :class="['btn', period===30 ? 'btn--primary' : 'btn--outline']" @click.prevent="changePeriod(30)">近30天</button>
        <button :class="['btn', period===15 ? 'btn--primary' : 'btn--outline']" @click.prevent="changePeriod(15)">近15天</button>
        <button :class="['btn', period===7 ? 'btn--primary' : 'btn--outline']" @click.prevent="changePeriod(7)">近7天</button>
      </div>

      <div class="stats-area">
        <div class="stat-card">
          <div class="value">{{ loading ? '...' : stats.totalCups }}</div>
          <div class="label">喝奶茶杯数</div>
        </div>
        <div class="stat-card">
          <div class="value">{{ loading ? '...' : stats.totalDays }}</div>
          <div class="label">喝奶茶天数</div>
        </div>
        <div class="stat-card">
          <div class="value">{{ loading ? '...' : (stats.totalAmount !== undefined ? stats.totalAmount.toFixed(2) : '0.00') }}</div>
          <div class="label">累计消费金额 (¥)</div>
        </div>
      </div>

      <div class="meta">
        <router-link to="/statistics">返回统计主页</router-link>
        <div v-if="error" class="error">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.controls { display:flex; gap:8px; align-items:center; margin-bottom:18px }
.stats-area { display:flex; gap:20px; justify-content:flex-start; align-items:stretch; flex-wrap:wrap }
.stat-card { flex:1 1 180px; background:#fff; padding:18px; border-radius:8px; text-align:center; box-shadow:0 6px 18px rgba(15,23,42,0.06) }
.stat-card .value { font-size:28px; font-weight:700; color:#2d3748 }
.stat-card .label { color:#718096; margin-top:6px }
.meta { margin-top:16px }
.error { color:#c00; margin-top:8px }

@media (max-width:800px) {
  .stats-area { flex-direction:column }
}
</style>
 