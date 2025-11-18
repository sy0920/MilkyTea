<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getUser, clearAuth } from '../../utils/auth'

const router = useRouter()
const user = ref(getUser() || { username: '游客' })

function goHome() {
	router.push('/home')
}

function goProfile() {
	router.push('/profile')
}

function logout() {
	clearAuth()
	router.push('/auth/login')
}

function goStatistics() {
	router.push('/statistics')
}

</script>

<template>
	<div class="dashboard-page">
		<header class="topbar">
			<div class="topbar-left">MilkyTea</div>
			<div class="topbar-right">
				<span class="greet">你好，{{ user.username }}</span>
				<button class="link" @click="goHome">主页</button>
				<button class="link" @click="goProfile">个人信息</button>
				<button class="link" @click="logout">退出登录</button>
			</div>
		</header>

		<main class="dashboard-main">
			<div class="cards">
				<div class="card" @click="router.push('/records')">
					<img src="/src/assets/logo.svg" alt="records" />
					<h3>奶茶记录</h3>
					<p>添加与查看消费记录</p>
				</div>
				<div class="card" @click="router.push('/calendar')">
					<img src="/src/assets/logo.svg" alt="calendar" />
					<h3>奶茶日历</h3>
					<p>按日期查看消费</p>
				</div>
				<div class="card" @click="goStatistics">
					<img src="/src/assets/logo.svg" alt="stats" />
					<h3>奶茶统计</h3>
					<p>查看消费统计与偏好</p>
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

.dashboard-main { padding:40px 24px }
.cards { display:flex; gap:20px; justify-content:center; align-items:stretch; flex-wrap:wrap }
.card { width:260px; background:#fff; border-radius:10px; padding:18px; box-shadow:0 8px 24px rgba(15,23,42,0.06); text-align:center; cursor:pointer; transition:transform .15s ease, box-shadow .15s }
.card img { width:72px; height:72px; margin-bottom:12px }
.card h3 { margin:8px 0 }
.card p { color:#718096; font-size:14px }
.card:hover { transform:translateY(-6px); box-shadow:0 14px 40px rgba(11,21,53,0.12) }

@media (max-width:800px) {
	.cards { flex-direction:column; align-items:center }
	.card { width:90% }
}
</style>