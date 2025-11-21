<script setup>
import LoginForm from '../../components/auth/LoginForm.vue'
</script>

<template>
  <div class="auth-container">
    <!-- Background Decorations -->
    <div class="bg-decoration circle-1"></div>
    <div class="bg-decoration circle-2"></div>
    
    <!-- Q-Version Milk Tea Animation -->
    <div class="milk-tea-anim">
      <div class="straw"></div>
      <div class="lid"></div>
      <div class="cup">
        <div class="liquid"></div>
        <div class="pearl p1"></div>
        <div class="pearl p2"></div>
        <div class="pearl p3"></div>
        <div class="face">
          <div class="eye left"></div>
          <div class="eye right"></div>
          <div class="mouth"></div>
        </div>
      </div>
    </div>

    <div class="auth-card">
      <div class="card-header">
        <h1 class="title">今天你喝奶茶了吗</h1>
      </div>
      <LoginForm />
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--mt-secondary);
  position: relative;
  overflow: hidden;
}

/* Background Circles */
.bg-decoration {
  position: absolute;
  border-radius: 50%;
  opacity: 0.6;
  z-index: 0;
}
.circle-1 {
  width: 600px;
  height: 600px;
  background: #FDE8D0;
  top: -200px;
  right: -100px;
}
.circle-2 {
  width: 400px;
  height: 400px;
  background: #E8D5C0;
  bottom: -100px;
  left: -100px;
}

/* Auth Card */
.auth-card {
  background: var(--mt-white);
  padding: 40px 50px;
  border-radius: 24px;
  box-shadow: var(--mt-shadow);
  width: 100%;
  max-width: 480px;
  z-index: 10;
  position: relative;
  text-align: center;
}

.title {
  font-size: 28px;
  color: var(--mt-text-main);
  margin-bottom: 30px;
  font-weight: 600;
  letter-spacing: 1px;
}

/* Milk Tea Animation */
.milk-tea-anim {
  position: absolute;
  left: 15%;
  bottom: 15%;
  transform: scale(1.5);
  z-index: 5;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: scale(1.5) translateY(0); }
  50% { transform: scale(1.5) translateY(-15px); }
}

.cup {
  width: 100px;
  height: 140px;
  background: rgba(255, 255, 255, 0.6);
  border: 4px solid var(--mt-text-main);
  border-radius: 10px 10px 40px 40px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(5px);
}

.liquid {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 85%;
  background: var(--mt-primary);
  border-top: 4px solid rgba(255,255,255,0.5);
}

.lid {
  width: 110px;
  height: 20px;
  background: var(--mt-text-main);
  position: absolute;
  top: -20px;
  left: -5px;
  border-radius: 10px 10px 0 0;
}

.straw {
  width: 12px;
  height: 60px;
  background: var(--mt-accent);
  position: absolute;
  top: -50px;
  left: 60px;
  transform: rotate(15deg);
  z-index: -1;
}

.pearl {
  width: 16px;
  height: 16px;
  background: var(--mt-text-main);
  border-radius: 50%;
  position: absolute;
  bottom: 10px;
}
.p1 { left: 20px; bottom: 15px; }
.p2 { left: 45px; bottom: 25px; }
.p3 { left: 70px; bottom: 10px; }

.face {
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 30px;
  z-index: 2;
}

.eye {
  width: 10px;
  height: 10px;
  background: var(--mt-text-main);
  border-radius: 50%;
  position: absolute;
  top: 0;
  animation: blink 4s infinite;
}
.eye.left { left: 10px; }
.eye.right { right: 10px; }

.mouth {
  width: 20px;
  height: 10px;
  border-bottom: 3px solid var(--mt-text-main);
  border-radius: 50%;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

@keyframes blink {
  0%, 96%, 100% { transform: scaleY(1); }
  98% { transform: scaleY(0.1); }
}
</style>