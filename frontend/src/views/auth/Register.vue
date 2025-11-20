<script setup>
import RegisterForm from '../../components/auth/RegisterForm.vue'
import logo from '../../assets/logo.svg'
</script>

<template>
  <div class="container">
    <div class="card auth-wrap">
      <div class="logo-wrap">
        <img :src="logo" alt="MilkyTea" class="logo" />
        <h1 class="brand">MilkyTea</h1>
      </div>
      <RegisterForm />
    </div>
  </div>
</template>

<style scoped>
.logo-wrap { display:flex; align-items:center; gap:12px; margin-bottom:16px; justify-content:center }
.logo { width:56px; height:56px }
.brand { font-size:22px; color:#2d3748; margin:0 }
</style>