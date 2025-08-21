<template>
    <div class="create-account-container">
      <div class="create-account-card">
        <div class="account-header">
          <button class="back-to-list-btn" @click="goBack">← 返回账号列表</button>
          <div class="header-content">
            <div class="header-icon">📱</div>
            <h2>添加新微信</h2>
            <p>欢迎 {{username}}！请填写微信账号信息，添加到您的账号管理中。</p>
          </div>
        </div>
  
        <form @submit.prevent="handleSubmit" class="account-form">
          <div class="form-group">
            <label for="wxname">微信昵称 *</label>
            <input
              type="text"
              id="wxname"
              v-model="formData.wxname"
              :class="{ error: !!errors.wxname }"
              placeholder="请输入微信昵称"
              @input="clearError('wxname')"
            />
            <span v-if="errors.wxname" class="error-message">{{ errors.wxname }}</span>
          </div>

          <div class="form-group">
            <label for="wxid">微信ID *</label>
            <input
              type="text"
              id="wxid"
              v-model="formData.wxid"
              :class="{ error: !!errors.wxid }"
              placeholder="请输入微信ID"
              @input="clearError('wxid')"
            />
            <span v-if="errors.wxid" class="error-message">{{ errors.wxid }}</span>
          </div>
          <div class="form-actions">
            <button type="submit" class="create-button" :disabled="loading">
              <template v-if="loading">
                <span class="loading-spinner"></span>
                添加中...
              </template>
              <template v-else>
                <span class="button-icon">➕</span>
                添加微信
              </template>
            </button>
          </div>
        </form>
  
        <div class="account-footer">
          <p>💡 提示：添加微信后可在账号管理中进行切换和管理</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '../stores/user'
  
  // 从 Pinia 获取当前登录用户名
  const router = useRouter();
  const userStore = useUserStore()
  const username = computed(() => userStore.username)
  const emit = defineEmits(['account-created', 'back-to-list']);
  
  const formData = reactive({
    wxname: '',
    wxid: ''
  });
  const loading = ref(false);
  const errors = reactive({});

  function clearError(name) {
    if (errors[name]) errors[name] = '';
  }
  
  function validateForm() {
    const newErrors = {};
    if (!formData.wxname.trim()) newErrors.wxname = '请输入微信昵称';
    if (!formData.wxid.trim()) newErrors.wxid = '请输入微信ID';
    Object.assign(errors, newErrors);
    return Object.keys(newErrors).length === 0;
  }
  
  async function handleSubmit() {
    if (!validateForm()) return;
    loading.value = true;

    try {
      const res = await fetch('/auth/wxregister', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userStore.username,
          password: userStore.password,
          wxid: formData.wxid,
          wxname: formData.wxname,
        })
      })
      const data = await res.json()
      if (data.state !== 'success') {
        alert(data.message || data.msg || '添加微信失败')
        loading.value = false
        return
      }
      // 同步更新 Pinia 中的 wxList
      userStore.setWxList([...(userStore.wxList || []), { wxid: formData.wxid, wxname: formData.wxname }])
      alert('添加微信成功')
      // 返回账号管理页面
      router.push('/manageaccount')
    } catch (e) {
      alert('网络错误，添加微信失败')
      loading.value = false
    }

  }
  
  function goBack() {
    router.push('/manageaccount');
  }
  </script>
  
  <style scoped>
  /* 主容器样式 */
  .create-account-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .create-account-card {
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 500px;
    overflow: hidden;
  }

  /* 头部样式 */
  .account-header {
    background: linear-gradient(135deg, #88CEE6, #64B5F6);
    color: white;
    padding: 40px 30px;
    position: relative;
    text-align: center;
  }

  .back-to-list-btn {
    position: absolute;
    top: 20px;
    left: 20px;
    background: rgba(255, 255, 255, 0.15);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
    padding: 8px 16px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .back-to-list-btn:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-1px);
  }
  /* 头部内容样式 */
  .header-content {
    text-align: center;
  }

  .header-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .account-header h2 {
    font-size: 28px;
    margin-bottom: 12px;
    font-weight: 700;
    line-height: 1.3;
  }

  .account-header p {
    font-size: 16px;
    opacity: 0.9;
    line-height: 1.6;
    margin: 0;
  }

  /* 表单样式 */
  .account-form {
    padding: 40px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;
  }

  .form-group label {
    font-size: 16px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 12px;
    line-height: 1.4;
  }

  .form-group input {
    padding: 16px 20px;
    border: 2px solid #e1e8ed;
    border-radius: 12px;
    font-size: 16px;
    font-family: inherit;
    transition: all 0.3s ease;
    background: white;
  }

  .form-group input:focus {
    outline: none;
    border-color: #88CEE6;
    box-shadow: 0 0 0 4px rgba(136, 206, 230, 0.1);
  }

  .form-group input.error {
    border-color: #e74c3c;
  }

  .form-group input.error:focus {
    box-shadow: 0 0 0 4px rgba(231, 76, 60, 0.1);
  }

  .error-message {
    color: #e74c3c;
    font-size: 14px;
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .error-message::before {
    content: '⚠️';
  }
  /* 按钮样式 */
  .form-actions {
    margin-top: 32px;
    display: flex;
    justify-content: center;
  }

  .create-button {
    background: linear-gradient(135deg, #88CEE6, #64B5F6);
    color: white;
    border: none;
    padding: 16px 40px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 200px;
    justify-content: center;
    box-shadow: 0 4px 15px rgba(136, 206, 230, 0.3);
  }

  .create-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(136, 206, 230, 0.4);
  }

  .create-button:active:not(:disabled) {
    transform: translateY(0);
  }

  .create-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 4px 15px rgba(136, 206, 230, 0.2);
  }

  .loading-spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .button-icon {
    font-size: 18px;
  }

  /* 页脚样式 */
  .account-footer {
    background: #f8f9fa;
    padding: 24px 40px;
    border-top: 1px solid #e1e8ed;
  }

  .account-footer p {
    color: #7f8c8d;
    font-size: 14px;
    margin: 0;
    text-align: center;
    line-height: 1.6;
  }
  /* 响应式设计 */
  @media (max-width: 768px) {
    .create-account-container {
      padding: 16px;
    }

    .create-account-card {
      max-width: 100%;
    }

    .account-header {
      padding: 50px 24px 32px;
    }

    .account-header h2 {
      font-size: 24px;
    }

    .back-to-list-btn {
      top: 16px;
      left: 16px;
      font-size: 12px;
      padding: 6px 12px;
    }

    .account-form {
      padding: 32px 24px;
    }

    .account-footer {
      padding: 20px 24px;
    }
  }

  @media (max-width: 480px) {
    .account-header {
      padding: 40px 20px 28px;
    }

    .account-header h2 {
      font-size: 22px;
    }

    .account-form {
      padding: 24px 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .create-button {
      width: 100%;
      min-width: auto;
    }

    .account-footer {
      padding: 16px 20px;
    }
  }
  </style>