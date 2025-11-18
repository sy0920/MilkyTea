<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getRecords } from '../../api/records'
import { getUser } from '../../utils/auth'

function formatDate(d) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

// simple function to build date array from start to end
function rangeDates(start, end) {
  const arr = []
  const cur = new Date(start)
  while (cur <= end) {
    arr.push(formatDate(new Date(cur)))
    cur.setDate(cur.getDate() + 1)
  }
  return arr
}

const router = useRouter()
const user = ref(getUser() || { username: '游客' })

const period = ref(30)
const loading = ref(false)
const error = ref('')
const labels = ref([])
const freqData = ref([])
const amountData = ref([])

async function load() {
  loading.value = true
  error.value = ''
  try {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - (period.value - 1))
    const startStr = formatDate(start)
    const endStr = formatDate(end)

    // fetch records in range
    const recs = await getRecords({ startDate: startStr, endDate: endStr })

    // normalize records list (assume array of { consumeDate, price })
    const days = rangeDates(start, end)
    const freqMap = {}
    const amtMap = {}
    days.forEach(d => { freqMap[d] = 0; amtMap[d] = 0 })
    if (Array.isArray(recs)) {
      recs.forEach(r => {
        const d = r.consumeDate ? r.consumeDate : (r.consume_date || '')
        if (!d) return
        if (!(d in freqMap)) {
          // ignore out-of-range
          return
        }
        freqMap[d] = (freqMap[d] || 0) + 1
        const price = Number(r.price ?? r.amount ?? 0) || 0
        amtMap[d] = (amtMap[d] || 0) + price
      })
    }
    labels.value = days
    freqData.value = days.map(d => freqMap[d] || 0)
    amountData.value = days.map(d => amtMap[d] || 0)
  } catch (e) {
    error.value = e.message || '加载失败'
  } finally { loading.value = false }
}

onMounted(() => load())

function changePeriod(v) { period.value = v; load() }
</script>

<template>
  <div class="trend-page">
    <header class="topbar">
      <div class="topbar-left">MilkyTea</div>
      <div class="topbar-right">
        <span class="greet">你好，{{ user.username }}</span>
        <button class="link" @click="router.push('/home')">主页</button>
        <button class="link" @click="router.push('/profile')">个人信息</button>
        <button class="link" @click="() => { localStorage.clear(); router.push('/auth/login') }">退出登录</button>
      </div>
    </header>

    <main class="trend-main">
      <div class="controls">
        <label>统计周期：</label>
        <button :class="{active: period===30}" @click.prevent="changePeriod(30)">近30天</button>
        <button :class="{active: period===15}" @click.prevent="changePeriod(15)">近15天</button>
        <button :class="{active: period===7}" @click.prevent="changePeriod(7)">近7天</button>
      </div>

      <section class="charts">
        <div class="chart-card">
          <h3>奶茶频率</h3>
          <svg viewBox="0 0 600 160" preserveAspectRatio="none" class="chart-svg">
            <polyline :points="(function(){
              const w = 580; const h = 120; const pad = 10; const n = labels.length
              if (n===0) return ''
              const max = Math.max(...freqData,1)
              return labels.map((_,i)=>{
                const x = pad + (i*(w)/(n-1||1))
                const y = pad + (h - (freqData[i]/max)*h)
                return `${x},${y}`
              }).join(' ')
            })()" fill="none" stroke="#3182ce" stroke-width="2" />
          </svg>
        </div>

        <div class="chart-card">
          <h3>消费金额 (¥)</h3>
          <svg viewBox="0 0 600 160" preserveAspectRatio="none" class="chart-svg">
            <polyline :points="(function(){
              const w = 580; const h = 120; const pad = 10; const n = labels.length
              if (n===0) return ''
              const max = Math.max(...amountData,1)
              return labels.map((_,i)=>{
                const x = pad + (i*(w)/(n-1||1))
                const y = pad + (h - (amountData[i]/max)*h)
                return `${x},${y}`
              }).join(' ')
            })()" fill="none" stroke="#38a169" stroke-width="2" />
          </svg>
        </div>
      </section>

      <div v-if="error" class="error">{{ error }}</div>
    </main>
  </div>
</template>

<style scoped>
.topbar { height:60px; display:flex; align-items:center; justify-content:space-between; padding:0 24px; background:#fff; box-shadow:0 1px 4px rgba(0,0,0,0.06) }
.topbar-left { font-weight:700; color:#2d3748 }
.topbar-right { display:flex; gap:12px; align-items:center }
.greet { color:#4a5568 }
.link { background:transparent; border:none; color:#2b6cb0; cursor:pointer }

.trend-main { padding:24px }
.controls { display:flex; gap:8px; align-items:center; margin-bottom:18px }
.controls button { padding:8px 12px; border-radius:6px; border:1px solid #e2e8f0; background:#fff; cursor:pointer }
.controls button.active { background:#3182ce; color:#fff; border-color:#3182ce }
.charts { display:flex; gap:20px; flex-wrap:wrap; justify-content:center }
.chart-card { width:48%; min-width:300px; background:#fff; padding:16px; border-radius:8px; box-shadow:0 6px 18px rgba(15,23,42,0.06) }
.chart-svg { width:100%; height:160px; }
.error { color:#c00; margin-top:8px }

@media (max-width:900px) {
  .chart-card { width:100% }
}
</style>
 