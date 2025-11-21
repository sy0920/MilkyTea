<script setup>
import RegisterForm from '../../components/auth/RegisterForm.vue'
</script>

<template>
  <div class="auth-container">
    <!-- Background Decorations -->
    <div class="bg-decoration circle-1"></div>
    <div class="bg-decoration circle-2"></div>
    
    <!-- Q-Version Milk Tea Animation (Mirrored or slightly different) -->
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
          <div class="mouth-happy"></div>
        </div>
      </div>
    </div>

    <div class="auth-card">
      <div class="card-header">
        <h1 class="title">今天你喝奶茶了吗</h1>
      </div>
      <RegisterForm />
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
  width: 500px;
  height: 500px;
  background: #D4A574;
  opacity: 0.1;
  top: -100px;
  left: -100px;
}
.circle-2 {
  width: 700px;
  height: 700px;
  background: #FDE8D0;
  bottom: -200px;
  right: -200px;
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
  right: 15%;
  bottom: 15%;
  transform: scale(1.5);
  z-index: 5;
  animation: float 3.5s ease-in-out infinite;
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
  height: 70%;
  background: #E6C9A8; /* Lighter tea */
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
  right: 60px;
  transform: rotate(-15deg);
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
.p1 { left: 25px; bottom: 20px; }
.p2 { left: 50px; bottom: 10px; }
.p3 { left: 75px; bottom: 25px; }

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

.mouth-happy {
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