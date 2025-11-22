import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'
import Profile from '../views/profile/Profile.vue'
import Dashboard from '../views/dashboard/Dashboard.vue'
import Statistics from '../views/statistics/Statistics.vue'
import BasicStats from '../views/statistics/BasicStats.vue'
import BrandAnalysis from '../views/statistics/BrandAnalysis.vue'
import TrendAnalysis from '../views/statistics/TrendAnalysis.vue'
import { getToken } from '../utils/auth'

const routes = [
    { path: '/', component: Login },
    { path: '/auth/login', component: Login },
    { path: '/auth/register', component: Register },
    { path: '/profile', component: Profile, meta: { requiresAuth: true } },
    { path: '/home', component: Dashboard, meta: { requiresAuth: true } },
    { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
    { path: '/statistics', component: Statistics, meta: { requiresAuth: true } },
    { path: '/statistics/basic', component: BasicStats, meta: { requiresAuth: true } },
    { path: '/statistics/brands', component: BrandAnalysis, meta: { requiresAuth: true } },
    { path: '/statistics/trend', component: TrendAnalysis, meta: { requiresAuth: true } }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to, from, next) => {
    if (to.meta && to.meta.requiresAuth) {
        const token = getToken()
        if (!token) return next({ path: '/auth/login', query: { redirect: to.fullPath } })
    }
    next()
})

export default router
