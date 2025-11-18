<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getUser, clearAuth } from '../../utils/auth'

const router = useRouter()
const user = ref(getUser() || { username: '游客' })

function goHome() { router.push('/home') }
function goProfile() { router.push('/profile') }
function logout() { clearAuth(); router.push('/auth/login') }

function goBasic() { router.push('/statistics/basic') }
function goBrands() { router.push('/statistics/brands') }
function goTrend() { router.push('/statistics/trend') }
</script>

<template>
	<div class="statistics-page">
		<header class="topbar">
			<div class="topbar-left">MilkyTea</div>
			<div class="topbar-right">
				<span class="greet">你好，{{ user.username }}</span>
				<button class="link" @click="goHome">主页</button>
				<button class="link" @click="goProfile">个人信息</button>
				<button class="link" @click="logout">退出登录</button>
			</div>
		</header>

		<main class="statistics-main">
			<div class="stats-cards">
				<div class="stat-card" @click="goBasic">
					<img src="/src/assets/logo.svg" alt="basic" />
					<h3>基础统计</h3>
					<p>总杯数、总金额、平均价格等</p>
				</div>
				<div class="stat-card" @click="goBrands">
					<img src="/src/assets/logo.svg" alt="brands" />
					<h3>品牌统计</h3>
					<p>按品牌查看消费分布</p>
				</div>
				<div class="stat-card" @click="goTrend">
					<img src="/src/assets/logo.svg" alt="trend" />
					<h3>趋势分析</h3>
					<p>消费趋势图表</p>
				</div>
			</div>
		</main>
	</div>
</template>

<style scoped>
.topbar { height:60px; display:flex; align-items:center; justify-content:space-between; padding:0 24px; background:#fff; box-shadow:0 1px 4px rgba(0,0,0,0.06) }
.topbar-left { font-weight:700; color:#2d3748 }
.topbar-right { display:flex; gap:12px; align-items:center }
.greet { color:#4a5568 }
.link { background:transparent; border:none; color:#2b6cb0; cursor:pointer }

.statistics-main { padding:40px 24px }
.stats-cards { display:flex; gap:20px; justify-content:center; align-items:stretch; flex-wrap:wrap }
.stat-card { width:300px; background:#fff; border-radius:10px; padding:18px; box-shadow:0 8px 24px rgba(15,23,42,0.06); text-align:center; cursor:pointer; transition:transform .15s ease, box-shadow .15s }
.stat-card img { width:72px; height:72px; margin-bottom:12px }
.stat-card h3 { margin:8px 0 }
.stat-card p { color:#718096; font-size:14px }
.stat-card:hover { transform:translateY(-6px); box-shadow:0 14px 40px rgba(11,21,53,0.12) }

@media (max-width:800px) {
	.stats-cards { flex-direction:column; align-items:center }
	.stat-card { width:90% }
}
</style>