<template>
  <div class="login-container">
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
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              <path d="M13 8H7"/>
              <path d="M17 12H7"/>
            </svg>
          </div>
          <h1 class="brand-title">智能销售助手</h1>
        </div>
        <div class="brand-description">
          <h2>AI驱动的销售管理平台</h2>
          <p>提升销售效率，优化客户管理，让每一次沟通都更有价值</p>
        </div>
        <div class="feature-highlights">
          <div class="feature-item">
            <div class="feature-icon">🏷️</div>
            <span>智能标签管理</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon">💬</div>
            <span>AI话术分析</span>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📚</div>
            <span>知识库管理</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧登录区域 -->
    <div class="login-section">
      <div class="login-card">
        <div class="login-header">
          <h2 class="login-title">欢迎回来</h2>
          <p class="login-subtitle">请登录您的账号继续使用</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label class="form-label">用户名</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input
                v-model="formData.username"
                type="text"
                name="username"
                placeholder="请输入用户名"
                required
                class="form-input"
                @input="clearError"
              />
            </div>
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
                v-model="formData.password"
                type="password"
                name="password"
                placeholder="请输入密码"
                required
                class="form-input"
                @input="clearError"
              />
            </div>
          </div>

          <div v-if="error" class="error-message">
            <svg class="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {{ error }}
          </div>

          <button type="submit" class="login-button" :disabled="loading">
            <span v-if="loading" class="loading-spinner"></span>
            <svg v-if="!loading" class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10,17 15,12 10,7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            {{ loading ? '登录中...' : '立即登录' }}
          </button>
        </form>

        <div class="login-footer">
          <div class="divider">
            <span>或</span>
          </div>
          <p class="register-prompt">
            还没有账号？
            <button type="button" class="link-button" @click="goRegister">
              立即注册
              <svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14"/>
                <path d="M12 5l7 7-7 7"/>
              </svg>
            </button>
          </p>
        </div>
      </div>
    </div>

    <!-- 微信号选择弹窗 -->
    <el-dialog
      v-model="showWxDialog"
      title="选择微信账号"
      width="480px"
      :close-on-click-modal="false"
      :show-close="false"
      class="wx-dialog"
    >
      <div class="wx-dialog-content">
        <div class="wx-dialog-header">
          <div class="wx-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h3>请选择要使用的微信账号</h3>
          <p>选择后将进入智能销售助手工作台</p>
        </div>
        <el-radio-group v-model="selectedWx" class="wx-radio-group">
          <div v-for="wx in wxList" :key="wx.wxid" class="wx-option">
            <el-radio :value="wx.wxid" class="wx-radio">
              <div class="wx-info">
                <div class="wx-details">
                  <div class="wx-name">{{ wx.wxname || '未命名账号' }}</div>
                </div>
              </div>
            </el-radio>
          </div>
        </el-radio-group>
      </div>
      <template #footer>
        <div class="wx-dialog-footer">
          <el-button type="primary" :disabled="!selectedWx" @click="confirmWx" class="confirm-btn">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="20,6 9,17 4,12"/>
            </svg>
            确认选择
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

interface WxAccount {
  wxid: string
  wxname: string
}

const loading = ref(false)
const error = ref('')
const formData = reactive({
  username: '',
  password: '',
})
const router = useRouter()
const userStore = useUserStore()

// 弹窗相关变量
const showWxDialog = ref(false)
const wxList = ref<WxAccount[]>([])
const selectedWx = ref<string | null>(null)

function clearError() {
  error.value = ''
}

async function handleLogin() {
  if (!formData.username || !formData.password) {
    ElMessage.error('用户名和密码不能为空！')
    return
  }
  loading.value = true
  error.value = ''
  try {
    const response = await fetch('/api/wxlogin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: formData.username, password: formData.password }),
    })
    if (response.ok) {
      const data = await response.json()
      console.log('接口返回:', data)
      if (data.state === 'success') {
        const user = data.user || { username: formData.username, email: '' }
        user.password = formData.password
        userStore.setUser({ username: formData.username, password: formData.password })
        // 只取 wxid, wxname 字段
        let wxs: WxAccount[] = []
        if (data.wx && Array.isArray(data.wx)) {
          wxs = data.wx.map((item: any) => ({ wxid: item.wxid, wxname: item.wxname }))
        } else if (data.data && Array.isArray(data.data)) {
          wxs = data.data.map((item: any) => ({ wxid: item.wxid, wxname: item.wxname }))
        }
        userStore.setWxList(wxs)
        wxList.value = wxs
        if (wxs.length > 0) {
          showWxDialog.value = true // 弹窗选择微信号
        } else {
          ElMessage.success('登录成功！')
          router.push('/dashboard')
        }
        return
      } else {
        ElMessage.error(data.msg || '请检查账号密码！')
        return
      }
    } else {
      ElMessage.error('登录失败，请检查网络连接')
    }
  } catch (error) {
    ElMessage.error(`登录出错: ${error}`)
  } finally {
    loading.value = false
  }
}

function confirmWx() {
  if (!selectedWx.value) {
    ElMessage.warning('请选择一个微信账号')
    return
  }
  const wxObj = wxList.value.find((wx) => wx.wxid === selectedWx.value)
  if (wxObj) {
    userStore.setSelectedWx(wxObj)
    ElMessage.success('登录成功！')
    showWxDialog.value = false
    router.push('/dashboard')
  } else {
    ElMessage.error('微信账号选择异常')
  }
}

function goRegister() {
  router.push('/register')
}
</script>

<style scoped>
/* 使用指定的四种颜色 */

/* 全局容器 */
.login-container {
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
  animation: float 8s ease-in-out infinite;
}

.bg-circle-1 {
  width: 400px;
  height: 400px;
  top: -200px;
  right: -200px;
  animation-delay: 0s;
}

.bg-circle-2 {
  width: 300px;
  height: 300px;
  bottom: -150px;
  left: -150px;
  animation-delay: 3s;
}

.bg-circle-3 {
  width: 200px;
  height: 200px;
  top: 30%;
  left: 20%;
  animation-delay: 6s;
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
  background-size: 50px 50px;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-30px) rotate(120deg); }
  66% { transform: translateY(15px) rotate(240deg); }
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
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.brand-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
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

.feature-highlights {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.feature-icon {
  font-size: 1.5rem;
  filter: grayscale(0.2);
}

.feature-item span {
  font-size: 1rem;
  font-weight: 500;
  color: #475569;
}

/* 右侧登录区域 */
.login-section {
  position: relative;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.login-title {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
}

.login-subtitle {
  margin: 0;
  font-size: 1rem;
  color: #64748b;
}

/* 表单样式 */
.login-form {
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
}

.form-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
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

/* 登录按钮 */
.login-button {
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

.login-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.login-button:hover::before {
  left: 100%;
}

.login-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #64B5F6, #42A5F5);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(136, 206, 230, 0.4);
}

.login-button:active {
  transform: translateY(0);
}

.login-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.login-button:disabled::before {
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

/* 登录页脚 */
.login-footer {
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

.register-prompt {
  margin: 0;
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

/* 微信弹窗样式 */
:deep(.wx-dialog .el-dialog) {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

:deep(.wx-dialog .el-dialog__header) {
  padding: 0;
  border-bottom: none;
}

:deep(.wx-dialog .el-dialog__title) {
  display: none;
}

:deep(.wx-dialog .el-dialog__body) {
  padding: 2rem;
}

:deep(.wx-dialog .el-dialog__footer) {
  padding: 0 2rem 2rem 2rem;
  border-top: none;
}

.wx-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.wx-dialog-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.wx-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #88CEE6, #64B5F6);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.wx-icon svg {
  width: 28px;
  height: 28px;
  stroke-width: 2;
}

.wx-dialog-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

.wx-dialog-header p {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
}

.wx-radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.wx-option {
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
  overflow: hidden;
}

.wx-option:hover {
  border-color: #88CEE6;
  background: rgba(136, 206, 230, 0.05);
}

:deep(.wx-radio) {
  width: 100%;
  margin: 0;
  padding: 1rem;
  border-radius: 0;
}

:deep(.wx-radio .el-radio__input) {
  display: none;
}

:deep(.wx-radio .el-radio__label) {
  width: 100%;
  padding: 0;
  font-size: 1rem;
  color: inherit;
}

.wx-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.wx-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.wx-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
}

:deep(.wx-radio.is-checked) {
  background: rgba(136, 206, 230, 0.1);
}

.wx-option:has(.el-radio.is-checked) {
  border-color: #88CEE6;
  background: rgba(136, 206, 230, 0.1);
}

.wx-dialog-footer {
  display: flex;
  justify-content: center;
}

.confirm-btn {
  background: linear-gradient(135deg, #88CEE6, #64B5F6) !important;
  border: none !important;
  border-radius: 12px !important;
  padding: 0.75rem 2rem !important;
  font-weight: 600 !important;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease !important;
}

.confirm-btn:hover {
  background: linear-gradient(135deg, #64B5F6, #42A5F5) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(136, 206, 230, 0.4) !important;
}

.confirm-btn:disabled {
  background: #9ca3af !important;
  transform: none !important;
  box-shadow: none !important;
}

.btn-icon {
  width: 16px;
  height: 16px;
  stroke-width: 2;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .login-container {
    grid-template-columns: 1fr;
  }

  .brand-section {
    display: none;
  }

  .login-section {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  }
}

@media (max-width: 768px) {
  .login-section {
    padding: 1rem;
  }

  .login-card {
    padding: 2rem;
    border-radius: 20px;
  }

  .login-title {
    font-size: 1.75rem;
  }

  .form-input {
    padding: 0.875rem 0.875rem 0.875rem 2.75rem;
  }

  .input-icon {
    left: 0.875rem;
    width: 18px;
    height: 18px;
  }

  .bg-circle-1,
  .bg-circle-2,
  .bg-circle-3 {
    display: none;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem;
    border-radius: 16px;
    margin: 1rem;
  }

  .login-title {
    font-size: 1.5rem;
  }

  .login-subtitle {
    font-size: 0.875rem;
  }

  .form-input {
    padding: 0.75rem 0.75rem 0.75rem 2.5rem;
    font-size: 0.875rem;
  }

  .input-icon {
    left: 0.75rem;
    width: 16px;
    height: 16px;
  }

  .login-button {
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

  :deep(.wx-dialog .el-dialog) {
    width: 90vw !important;
    margin: 0 !important;
  }

  .wx-dialog-content {
    gap: 1rem;
  }

  .wx-icon {
    width: 50px;
    height: 50px;
  }

  .wx-icon svg {
    width: 24px;
    height: 24px;
  }

  .wx-dialog-header h3 {
    font-size: 1.125rem;
  }

  .wx-avatar {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .wx-info {
    gap: 0.75rem;
  }

  .wx-name {
    font-size: 0.875rem;
  }

}
</style>
