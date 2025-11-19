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
	<div>
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
			<div class="container">
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

.dashboard-main { 
	padding: 60px 0;
	min-height: calc(100vh - 60px);
	display: flex;
	align-items: center;
}
.container {
	width: 100%;
}
.cards { 
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 32px;
	max-width: 1200px;
	margin: 0 auto;
}
.card { 
	background:#fff; 
	border-radius:12px; 
	padding: 32px 24px; 
	box-shadow:0 8px 24px rgba(15,23,42,0.06); 
	text-align:center; 
	cursor:pointer; 
	transition:transform .2s ease, box-shadow .2s;
	min-height: 280px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.card img { width:80px; height:80px; margin-bottom:16px }
.card h3 { margin:12px 0 8px; font-size: 20px; font-weight: 600; color: #2d3748 }
.card p { color:#718096; font-size:15px; line-height: 1.5 }
.card:hover { 
	transform:translateY(-8px); 
	box-shadow:0 16px 48px rgba(11,21,53,0.15) 
}

@media (max-width:1024px) {
	.cards { 
		grid-template-columns: repeat(2, 1fr);
		gap: 24px;
	}
	.dashboard-main {
		padding: 40px 0;
	}
}

@media (max-width:768px) {
	.cards { 
		grid-template-columns: 1fr;
		gap: 20px;
		max-width: 500px;
	}
	.card {
		min-height: 240px;
		padding: 24px 20px;
	}
	.dashboard-main {
		padding: 32px 0;
	}
}
</style>