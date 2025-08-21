<template>
  <div class="register-container">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="bg-circle bg-circle-1"></div>
      <div class="bg-circle bg-circle-2"></div>
      <div class="bg-circle bg-circle-3"></div>
      <div class="bg-grid"></div>
    </div>

    <!-- 左侧品牌区域 -->
    <div class="brand-section">
      <div class="brand-content">
        <div class="brand-logo">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <path d="M20 8v6"/>
              <path d="M23 11h-6"/>
            </svg>
          </div>
          <h1 class="brand-title">加入我们</h1>
        </div>
        <div class="brand-description">
          <h2>开启智能销售之旅</h2>
          <p>注册账号，立即体验AI驱动的销售管理平台，让每一次沟通都更有价值</p>
        </div>
        <div class="benefit-highlights">
          <div class="benefit-item">
            <div class="benefit-icon">⚡</div>
            <div class="benefit-text">
              <h4>快速上手</h4>
              <p>简单几步即可开始使用</p>
            </div>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon">🎯</div>
            <div class="benefit-text">
              <h4>精准分析</h4>
              <p>AI智能分析销售话术</p>
            </div>
          </div>
          <div class="benefit-item">
            <div class="benefit-icon">📈</div>
            <div class="benefit-text">
              <h4>效率提升</h4>
              <p>显著提高销售转化率</p>
            </div>
          </div>
        </div>
        <div class="stats-section">
          <div class="stat-item">
            <div class="stat-number">1000+</div>
            <div class="stat-label">活跃用户</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">95%</div>
            <div class="stat-label">满意度</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧注册区域 -->
    <div class="register-section">
      <div class="register-card">
        <div class="register-header">
          <div class="progress-indicator">
            <div class="step active">
              <div class="step-number">1</div>
              <span>创建账号</span>
            </div>
            <div class="step-line"></div>
            <div class="step">
              <div class="step-number">2</div>
              <span>开始使用</span>
            </div>
          </div>
          <h2 class="register-title">创建新账号</h2>
          <p class="register-subtitle">请填写以下信息完成注册</p>
        </div>

        <form class="register-form" @submit.prevent="handleRegister">
          <div class="form-group">
            <label class="form-label">用户名</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input
                v-model="regUsername"
                class="form-input"
                type="text"
                placeholder="请输入用户名"
                required
              />
              <div class="input-status" :class="{ valid: regUsername.length >= 3 }">
                <svg v-if="regUsername.length >= 3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
              </div>
            </div>
            <div class="input-hint">用户名至少3个字符</div>
          </div>

          <div class="form-group">
            <label class="form-label">密码</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <circle cx="12" cy="16" r="1"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                v-model="regPassword"
                class="form-input"
                type="password"
                placeholder="请输入密码"
                required
              />
              <div class="input-status" :class="{ valid: regPassword.length >= 6 }">
                <svg v-if="regPassword.length >= 6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
              </div>
            </div>
            <div class="password-strength">
              <div class="strength-bar">
                <div class="strength-fill" :class="getPasswordStrength()"></div>
              </div>
              <span class="strength-text">{{ getPasswordStrengthText() }}</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">确认密码</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <circle cx="12" cy="16" r="1"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                v-model="regPassword2"
                class="form-input"
                type="password"
                placeholder="请再次输入密码"
                required
              />
              <div class="input-status" :class="{ valid: regPassword2 && regPassword === regPassword2 }">
                <svg v-if="regPassword2 && regPassword === regPassword2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="20,6 9,17 4,12"/>
                </svg>
              </div>
            </div>
            <div class="input-hint" :class="{ error: regPassword2 && regPassword !== regPassword2 }">
              {{ regPassword2 && regPassword !== regPassword2 ? '密码不一致' : '请确认您的密码' }}
            </div>
          </div>

          <div v-if="regError" class="error-message">
            <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {{ regError }}
          </div>

          <button class="register-button" type="submit" :disabled="regLoading || !isFormValid">
            <span v-if="regLoading" class="loading-spinner"></span>
            <svg v-if="!regLoading" class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <path d="M20 8v6"/>
              <path d="M23 11h-6"/>
            </svg>
            {{ regLoading ? '注册中...' : '创建账号' }}
          </button>
        </form>

        <div class="register-footer">
          <div class="divider">
            <span>或</span>
          </div>
          <p class="login-prompt">
            已有账号？
            <button type="button" class="link-button" @click="goLogin">
              立即登录
              <svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14"/>
                <path d="M12 5l7 7-7 7"/>
              </svg>
            </button>
          </p>
          <div class="terms-notice">
            <p>注册即表示您同意我们的 <a href="#" class="terms-link">服务条款</a> 和 <a href="#" class="terms-link">隐私政策</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const regUsername = ref('')
const regPassword = ref('')
const regPassword2 = ref('')
const regLoading = ref(false)
const regError = ref('')
const router = useRouter()

// 计算属性：表单验证
const isFormValid = computed(() => {
  return regUsername.value.length >= 3 &&
         regPassword.value.length >= 6 &&
         regPassword2.value &&
         regPassword.value === regPassword2.value
})

// 密码强度计算
function getPasswordStrength() {
  const password = regPassword.value
  if (password.length === 0) return ''

  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 2) return 'weak'
  if (score <= 4) return 'medium'
  return 'strong'
}

// 密码强度文本
function getPasswordStrengthText() {
  const strength = getPasswordStrength()
  switch (strength) {
    case 'weak': return '弱'
    case 'medium': return '中等'
    case 'strong': return '强'
    default: return ''
  }
}

function validateRegister() {
  if (!regUsername.value || !regPassword.value || !regPassword2.value) {
    regError.value = '请填写完整注册信息！'
    return false
  }
  if (regUsername.value.length < 3) {
    regError.value = '用户名至少3个字符！'
    return false
  }
  if (regPassword.value !== regPassword2.value) {
    regError.value = '两次输入的密码不一致！'
    return false
  }
  if (regPassword.value.length < 6) {
    regError.value = '密码长度至少6位！'
    return false
  }
  return true
}

const handleRegister = async () => {
  regError.value = ''
  if (!validateRegister()) return
  regLoading.value = true
  try {
    const response = await fetch(`/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: regUsername.value,
        password: regPassword.value,
      }),
    })
    if (response.ok) {
      const data = await response.json()
      if (data.state === 'success') {
        // 显示成功消息
        showSuccessMessage()
        // 延迟跳转到登录页
        setTimeout(() => {
          router.push({
            path: '/',
            query: { username: regUsername.value },
          })
        }, 2000)
      } else {
        regError.value = data.msg || '注册失败！'
      }
    } else {
      regError.value = '注册失败，请检查网络连接'
    }
  } catch (error) {
    regError.value = `注册出错: ${error}`
  } finally {
    regLoading.value = false
  }
}

// 显示成功消息
function showSuccessMessage() {
  alert('🎉 注册成功！即将跳转到登录页面...')
}

const goLogin = () => {
  router.push('/')
}
</script>

<style scoped>
/* 现代化注册页面样式 - 与Dashboard和Login统一的设计语言 */

/* 全局容器 */
.register-container {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
  overflow: hidden;
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
  background: linear-gradient(135deg, rgba(136, 206, 230, 0.08), rgba(178, 211, 168, 0.08));
  animation: float 10s ease-in-out infinite;
}

.bg-circle-1 {
  width: 350px;
  height: 350px;
  top: -175px;
  left: -175px;
  animation-delay: 0s;
}

.bg-circle-2 {
  width: 250px;
  height: 250px;
  bottom: -125px;
  right: -125px;
  animation-delay: 4s;
}

.bg-circle-3 {
  width: 180px;
  height: 180px;
  top: 40%;
  right: 30%;
  animation-delay: 8s;
}

.bg-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(136, 206, 230, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(136, 206, 230, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-25px) rotate(90deg); }
  50% { transform: translateY(10px) rotate(180deg); }
  75% { transform: translateY(-15px) rotate(270deg); }
}

/* 左侧品牌区域 */
.brand-section {
  position: relative;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background: linear-gradient(135deg, rgba(136, 206, 230, 0.1), rgba(178, 211, 168, 0.1));
  backdrop-filter: blur(20px);
}

.brand-content {
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.brand-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
}

.logo-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #88CEE6, #64B5F6);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 10px 30px rgba(136, 206, 230, 0.3);
}

.logo-icon svg {
  width: 40px;
  height: 40px;
  stroke-width: 2;
}

.brand-title {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #475569, #88CEE6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-description {
  text-align: center;
}

.brand-description h2 {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
}

.brand-description p {
  margin: 0;
  font-size: 1.125rem;
  color: #64748b;
  line-height: 1.6;
}

.benefit-highlights {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s ease;
}

.benefit-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(136, 206, 230, 0.15);
}

.benefit-icon {
  font-size: 2rem;
  filter: grayscale(0.2);
  flex-shrink: 0;
}

.benefit-text h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
}

.benefit-text p {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
}

.stats-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 800;
  color: #88CEE6;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

/* 右侧注册区域 */
.register-section {
  position: relative;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
}

.register-card {
  width: 100%;
  max-width: 480px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.register-header {
  margin-bottom: 2.5rem;
}

/* 进度指示器 */
.progress-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background: linear-gradient(135deg, #88CEE6, #64B5F6);
  color: white;
  box-shadow: 0 4px 15px rgba(136, 206, 230, 0.3);
}

.step span {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

.step.active span {
  color: #1e293b;
  font-weight: 600;
}

.step-line {
  width: 60px;
  height: 2px;
  background: #e5e7eb;
  border-radius: 1px;
}

.register-title {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  text-align: center;
}

.register-subtitle {
  margin: 0;
  font-size: 1rem;
  color: #64748b;
  text-align: center;
}

/* 表单样式 */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-left: 0.25rem;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  stroke: #9ca3af;
  stroke-width: 2;
  pointer-events: none;
  z-index: 2;
}

.form-input {
  width: 100%;
  padding: 1rem 3.5rem 1rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.8);
  color: #1f2937;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #88CEE6;
  box-shadow: 0 0 0 4px rgba(136, 206, 230, 0.1);
  background: white;
}

.form-input:focus + .input-icon {
  stroke: #88CEE6;
}

.form-input::placeholder {
  color: #9ca3af;
}

.input-status {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  opacity: 0;
  transition: all 0.3s ease;
}

.input-status.valid {
  opacity: 1;
}

.input-status svg {
  width: 20px;
  height: 20px;
  stroke: #10B981;
  stroke-width: 2;
}

.input-hint {
  font-size: 0.75rem;
  color: #64748b;
  margin-left: 0.25rem;
  transition: color 0.3s ease;
}

.input-hint.error {
  color: #dc2626;
}

/* 密码强度指示器 */
.password-strength {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  border-radius: 2px;
  transition: all 0.3s ease;
  width: 0;
}

.strength-fill.weak {
  width: 33%;
  background: #dc2626;
}

.strength-fill.medium {
  width: 66%;
  background: #f59e0b;
}

.strength-fill.strong {
  width: 100%;
  background: #10B981;
}

.strength-text {
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  min-width: 30px;
}

/* 错误消息 */
.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  color: #dc2626;
  padding: 1rem;
  border-radius: 12px;
  font-size: 0.875rem;
  border: 1px solid #fecaca;
  backdrop-filter: blur(10px);
}

.error-icon {
  width: 18px;
  height: 18px;
  stroke-width: 2;
  flex-shrink: 0;
}

/* 注册按钮 */
.register-button {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #88CEE6, #64B5F6);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

.register-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.register-button:hover::before {
  left: 100%;
}

.register-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #64B5F6, #42A5F5);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(136, 206, 230, 0.4);
}

.register-button:active {
  transform: translateY(0);
}

.register-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.register-button:disabled::before {
  display: none;
}

.button-icon {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 注册页脚 */
.register-footer {
  margin-top: 2rem;
  text-align: center;
}

.divider {
  position: relative;
  margin: 1.5rem 0;
  text-align: center;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
}

.divider span {
  background: rgba(255, 255, 255, 0.95);
  padding: 0 1rem;
  color: #9ca3af;
  font-size: 0.875rem;
  position: relative;
  z-index: 1;
}

.login-prompt {
  margin: 0 0 1.5rem 0;
  font-size: 0.875rem;
  color: #64748b;
}

.link-button {
  background: none;
  border: none;
  color: #88CEE6;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: 0.25rem;
}

.link-button:hover {
  color: #64B5F6;
  transform: translateX(2px);
}

.link-icon {
  width: 14px;
  height: 14px;
  stroke-width: 2;
  transition: transform 0.3s ease;
}

.link-button:hover .link-icon {
  transform: translateX(2px);
}

.terms-notice {
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.terms-notice p {
  margin: 0;
  font-size: 0.75rem;
  color: #9ca3af;
  line-height: 1.5;
}

.terms-link {
  color: #88CEE6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.terms-link:hover {
  color: #64B5F6;
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .register-container {
    grid-template-columns: 1fr;
  }

  .brand-section {
    display: none;
  }

  .register-section {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  }
}

@media (max-width: 768px) {
  .register-section {
    padding: 1rem;
  }

  .register-card {
    padding: 2rem;
    border-radius: 20px;
  }

  .register-title {
    font-size: 1.75rem;
  }

  .form-input {
    padding: 0.875rem 3.25rem 0.875rem 2.75rem;
  }

  .input-icon {
    left: 0.875rem;
    width: 18px;
    height: 18px;
  }

  .input-status {
    right: 0.875rem;
  }

  .bg-circle-1,
  .bg-circle-2,
  .bg-circle-3 {
    display: none;
  }
}

@media (max-width: 480px) {
  .register-card {
    padding: 1.5rem;
    border-radius: 16px;
    margin: 1rem;
  }

  .register-title {
    font-size: 1.5rem;
  }

  .register-subtitle {
    font-size: 0.875rem;
  }

  .form-input {
    padding: 0.75rem 3rem 0.75rem 2.5rem;
    font-size: 0.875rem;
  }

  .input-icon {
    left: 0.75rem;
    width: 16px;
    height: 16px;
  }

  .input-status {
    right: 0.75rem;
    width: 18px;
    height: 18px;
  }

  .register-button {
    padding: 0.875rem;
    font-size: 0.875rem;
  }

  .button-icon {
    width: 18px;
    height: 18px;
  }

  .loading-spinner {
    width: 18px;
    height: 18px;
  }

  .progress-indicator {
    gap: 0.5rem;
  }

  .step-number {
    width: 32px;
    height: 32px;
    font-size: 0.75rem;
  }

  .step-line {
    width: 40px;
  }
}


</style>