<script setup>
import RegisterForm from '../../components/auth/RegisterForm.vue'
import logo from '../../assets/logo.svg'
</script>

<template>
  <div class="auth-page">
    <div class="auth-wrap">
      <div class="logo-wrap">
        <img :src="logo" alt="MilkyTea" class="logo" />
        <h1 class="brand">MilkyTea</h1>
      </div>
      <RegisterForm />
    </div>
  </div>
</template>

<style scoped>
.auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f7fafc }
.auth-wrap { width: 100%; max-width: 640px; padding: 24px }
.logo-wrap { display:flex; align-items:center; gap:12px; margin-bottom:16px; justify-content:center }
.logo { width:56px; height:56px }
.brand { font-size:22px; color:#2d3748; margin:0 }
</style>