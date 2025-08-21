<template>
  <!-- 加载状态 -->
  <div v-if="isLoading" class="loading-container">
    <div class="loading-spinner"></div>
    <p>正在加载工作台...</p>
  </div>

  <!-- Dashboard内容 -->
  <div v-else-if="user" class="dashboard-container">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="bg-circle bg-circle-1"></div>
      <div class="bg-circle bg-circle-2"></div>
      <div class="bg-circle bg-circle-3"></div>
    </div>
    <!-- 顶部导航栏 -->
    <header class="dashboard-header">
      <div class="header-content">
        <div class="user-section">
          <div class="avatar-wrapper">
            <div class="avatar">{{ user.username ? user.username.charAt(0).toUpperCase() : '' }}</div>
            <div class="status-indicator"></div>
          </div>
          <div class="user-info">
            <h2 class="welcome-text">欢迎回来，{{ user.username || '' }}！</h2>
            <p class="user-subtitle">祝你今天也发财~~</p>
          </div>
        </div>
        <div class="header-actions">
          <button class="action-btn secondary" @click="handleModuleClick('返回账号列表')">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            返回账号列表
          </button>
          <button class="action-btn primary" @click="handleLogout">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            退出登录
          </button>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="dashboard-main">
      <!-- 欢迎区域 -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">智能销售助手</h1>
            <p class="hero-subtitle">AI驱动的销售管理平台，提升您的销售效率</p>
          </div>
        </div>
      </section>

      <!-- 功能模块区域 -->
      <section class="modules-section">
        <div class="section-header">
          <h2 class="section-title">功能模块</h2>
          <p class="section-subtitle">选择您需要的功能开始工作</p>
        </div>

        <div class="modules-grid">
          <div class="module-card crm" @click="handleModuleClick('客户标签配置')">
            <div class="card-header">
              <div class="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                  <line x1="7" y1="7" x2="7.01" y2="7"/>
                </svg>
              </div>
              <div class="card-badge">CRM</div>
            </div>
            <div class="card-content">
              <h3 class="card-title">客户标签配置</h3>
              <p class="card-description">管理客户类型与配置，建立客户分类体系</p>
              <div class="card-features">
                <span class="feature-tag">客户分类</span>
                <span class="feature-tag">标签管理</span>
              </div>
            </div>
            <div class="card-footer">
              <span class="enter-text">立即进入</span>
              <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </div>

          <div class="module-card prompt" @click="handleModuleClick('销售话术分析')">
            <div class="card-header">
              <div class="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div class="card-badge">AI</div>
            </div>
            <div class="card-content">
              <h3 class="card-title">销售话术分析</h3>
              <p class="card-description">AI智能分析和优化销售话术，提升沟通转化率</p>
              <div class="card-features">
                <span class="feature-tag">AI分析</span>
                <span class="feature-tag">话术优化</span>
              </div>
            </div>
            <div class="card-footer">
              <span class="enter-text">立即进入</span>
              <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </div>

          <div class="module-card kb" @click="handleModuleClick('知识库')">
            <div class="card-header">
              <div class="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
              </div>
              <div class="card-badge">知识</div>
            </div>
            <div class="card-content">
              <h3 class="card-title">知识库管理</h3>
              <p class="card-description">维护和管理业务知识内容，构建智能问答体系</p>
              <div class="card-features">
                <span class="feature-tag">知识管理</span>
                <span class="feature-tag">智能问答</span>
              </div>
            </div>
            <div class="card-footer">
              <span class="enter-text">立即进入</span>
              <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
  <div v-else class="not-login">
    <div class="login-prompt">
      <div class="login-icon">🔐</div>
      <h3>请先登录</h3>
      <p>登录后即可使用智能销售助手的所有功能</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const user = computed(() => userStore.user)
const router = useRouter()
const isLoading = ref(true)

// 检查用户状态
onMounted(() => {
  console.log('Dashboard mounted, user:', user.value)

  // 模拟检查用户状态的过程
  setTimeout(() => {
    if (!user.value) {
      console.log('No user found, redirecting to login')
      router.push('/')
    } else {
      console.log('User found:', user.value)
    }
    isLoading.value = false
  }, 100) // 短暂延迟以显示加载状态
})


function handleModuleClick(moduleName: string) {
  switch (moduleName) {
    case '客户标签配置':
      router.push('/configlabel')
      break
    case '销售话术分析':
      router.push('/main')
      break
    case '知识库':
      router.push('/script-config')
      break
    case '返回账号列表':
      router.push('/manageaccount')
      break
    default:
      break
  }
}

function handleLogout() {
  userStore.clearUser()
  router.push('/')
}
</script>

<style scoped>
/* 全局容器 */
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
  overflow-x: hidden;
}

/* 背景装饰 */
.bg-decoration {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(136, 206, 230, 0.1), rgba(178, 211, 168, 0.1));
  animation: float 6s ease-in-out infinite;
}

.bg-circle-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  right: -150px;
  animation-delay: 0s;
}

.bg-circle-2 {
  width: 200px;
  height: 200px;
  bottom: -100px;
  left: -100px;
  animation-delay: 2s;
}

.bg-circle-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

/* 顶部导航栏 */
.dashboard-header {
  position: relative;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  padding: 1rem 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar-wrapper {
  position: relative;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #88CEE6, #64B5F6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: 700;
  box-shadow: 0 8px 25px rgba(136, 206, 230, 0.3);
  border: 3px solid white;
}

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  background: #10B981;
  border-radius: 50%;
  border: 3px solid white;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.welcome-text {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  background: linear-gradient(135deg, #1e293b, #475569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.user-subtitle {
  margin: 0;
  font-size: 1rem;
  color: #64748b;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  text-decoration: none;
}

.action-btn.secondary {
  background: white;
  color: #475569;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.action-btn.secondary:hover {
  background: #f8fafc;
  border-color: #88CEE6;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(136, 206, 230, 0.15);
}

.action-btn.primary {
  background: linear-gradient(135deg, #88CEE6, #64B5F6);
  color: white;
  box-shadow: 0 4px 15px rgba(136, 206, 230, 0.3);
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(136, 206, 230, 0.4);
}

.btn-icon {
  width: 18px;
  height: 18px;
  stroke-width: 2;
}

/* 主要内容区域 */
.dashboard-main {
  position: relative;
  z-index: 5;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

/* 欢迎区域 */
.hero-section {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
}

.hero-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  align-items: center;
}

.hero-text {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.hero-title {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #475569, #88CEE6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.hero-subtitle {
  margin: 0;
  font-size: 1.25rem;
  color: #64748b;
  line-height: 1.6;
}

/* 功能模块区域 */
.modules-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 1rem;
}

.section-title {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
}

.section-subtitle {
  margin: 0;
  font-size: 1.125rem;
  color: #64748b;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 2rem;
}

.module-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
}

.module-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #88CEE6, #64B5F6);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.module-card:hover::before {
  transform: scaleX(1);
}

.module-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border-color: rgba(136, 206, 230, 0.3);
}

.module-card.crm::before {
  background: linear-gradient(90deg, #88CEE6, #64B5F6);
}

.module-card.prompt::before {
  background: linear-gradient(90deg, #B2D3A8, #81C784);
}

.module-card.kb::before {
  background: linear-gradient(90deg, #88CEE6, #64B5F6);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(136, 206, 230, 0.1), rgba(136, 206, 230, 0.2));
  border: 1px solid rgba(136, 206, 230, 0.2);
}

.card-icon svg {
  width: 28px;
  height: 28px;
  stroke: #88CEE6;
  stroke-width: 2;
}

.module-card.prompt .card-icon {
  background: linear-gradient(135deg, rgba(178, 211, 168, 0.1), rgba(178, 211, 168, 0.2));
  border-color: rgba(178, 211, 168, 0.2);
}

.module-card.prompt .card-icon svg {
  stroke: #B2D3A8;
}

.card-badge {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #88CEE6, #64B5F6);
  color: white;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.module-card.prompt .card-badge {
  background: linear-gradient(135deg, #B2D3A8, #81C784);
}

.card-content {
  margin-bottom: 2rem;
}

.card-title {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.card-description {
  margin: 0 0 1.5rem 0;
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
}

.card-features {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.feature-tag {
  padding: 0.5rem 1rem;
  background: rgba(136, 206, 230, 0.1);
  color: #88CEE6;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid rgba(136, 206, 230, 0.2);
}

.module-card.prompt .feature-tag {
  background: rgba(178, 211, 168, 0.1);
  color: #B2D3A8;
  border-color: rgba(178, 211, 168, 0.2);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
}

.enter-text {
  font-size: 1rem;
  font-weight: 600;
  color: #475569;
}

.arrow-icon {
  width: 20px;
  height: 20px;
  stroke: #88CEE6;
  stroke-width: 2;
  transition: transform 0.3s ease;
}

.module-card:hover .arrow-icon {
  transform: translateX(4px);
}

.module-card.prompt:hover .arrow-icon {
  stroke: #B2D3A8;
}

/* 未登录状态 */
.not-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.login-prompt {
  text-align: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
  max-width: 400px;
}

.login-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  filter: grayscale(0.3);
}

.login-prompt h3 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.login-prompt p {
  margin: 0;
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .dashboard-main {
    padding: 1.5rem;
  }

  .hero-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 1rem;
    flex-direction: column;
    gap: 1rem;
  }

  .user-section {
    width: 100%;
    justify-content: center;
  }

  .header-actions {
    width: 100%;
    justify-content: center;
  }

  .dashboard-main {
    padding: 1rem;
    gap: 2rem;
  }

  .hero-section {
    padding: 2rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .modules-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .module-card {
    padding: 1.5rem;
  }

  .quick-actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .bg-circle-1,
  .bg-circle-2,
  .bg-circle-3 {
    display: none;
  }
}

@media (max-width: 480px) {
  .action-btn {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }

  .btn-icon {
    width: 16px;
    height: 16px;
  }

  .hero-section {
    padding: 1.5rem;
  }

  .module-card {
    padding: 1rem;
  }

  .card-icon {
    width: 50px;
    height: 50px;
  }

  .card-icon svg {
    width: 24px;
    height: 24px;
  }

  .quick-actions-grid {
    grid-template-columns: 1fr;
  }

  .quick-action-item {
    padding: 1rem;
  }
}
</style>
