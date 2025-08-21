<template>
  <div class="manage-account-wrapper">
    <div class="manage-account-header">
      <button class="back-button" @click="goBackToDashboard">返回功能面板</button>
      <div class="account-header">
        <h2>账号管理</h2>
        <p>当前登录账号下的所有微信号</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" class="add-wx-btn" @click="goToCreateAccount">添加新微信</el-button>
      </div>
    </div>
    <div class="wx-list-section">
      <el-card v-for="wx in wxList" :key="wx.wxid" class="wx-card">
        <div class="wx-card-row">
          <div class="wx-info">
            <span class="wxid">微信ID：{{ wx.wxid }}</span>
            <span class="wxname">微信昵称：{{ wx.wxname }}</span>
          </div>
          <el-button
            :disabled="selectedWx && selectedWx.wxid === wx.wxid"
            type="primary"
            @click="switchWx(wx)"
            class="switch-btn"
          >
            {{ selectedWx && selectedWx.wxid === wx.wxid ? '已登录' : '点击切换' }}
          </el-button>
        </div>
      </el-card>
      <div v-if="wxList.length === 0" class="empty-tip">暂无微信号数据</div>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const wxList = ref<Array<{ wxid: string; wxname: string }>>(userStore.wxList)
const selectedWx = computed(() => userStore.selectedWx)

const goBackToDashboard = () => {
  router.push('/dashboard')
}

const goToCreateAccount = () => {
  router.push('/create-account')
}

const fetchWxList = async () => {
  const username = userStore.username
  const password = userStore.password
  if (!username || !password) return
  try {
    const response = await fetch(`/api/getwx`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (response.ok) {
      const data = await response.json()
      if (data.wx && Array.isArray(data.wx)) {
        wxList.value = data.wx
        userStore.setWxList(data.wx)
      }
    }
  } catch (e) {
    // 错误处理
  }
}

const switchWx = (wx: { wxid: string; wxname: string }) => {
  if (selectedWx.value?.wxid !== wx.wxid) {
    userStore.setSelectedWx(wx)
  }
}


onMounted(() => {
  fetchWxList() // 每次进入页面都刷新列表
})
</script>

<style scoped>
/* 主容器样式 */
.manage-account-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

/* 头部区域 */
.manage-account-header {
  max-width: 1000px;
  margin: 0 auto 30px;
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.account-header {
  text-align: center;
  flex: 1;
}

.account-header h2 {
  color: #2c3e50;
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.account-header p {
  color: #7f8c8d;
  font-size: 16px;
  margin: 0;
}

/* 返回按钮 */
.back-button {
  padding: 12px 20px;
  background: transparent;
  color: #88CEE6;
  border: 2px solid #88CEE6;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}
.back-button:hover {
  background: linear-gradient(135deg, #88CEE6, #64B5F6);
  color: white;
  transform: translateY(-2px);
}

/* 添加微信按钮 */
.header-actions {
  display: flex;
  gap: 12px;
}

.add-wx-btn {
  background: linear-gradient(135deg, #88CEE6, #64B5F6) !important;
  border: none !important;
  border-radius: 12px !important;
  padding: 12px 24px !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  color: white !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 12px rgba(136, 206, 230, 0.3) !important;
}

.add-wx-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(136, 206, 230, 0.4) !important;
}

/* 微信列表区域 */
.wx-list-section {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}
/* 微信卡片样式 */
.wx-card {
  border-radius: 16px !important;
  border: none !important;
  background: white !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
  transition: all 0.3s ease !important;
  overflow: hidden !important;
}

.wx-card:hover {
  transform: translateY(-4px) !important;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15) !important;
}

.wx-card-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
}

.wx-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.wx-info .wxid {
  font-size: 16px;
  color: #2c3e50;
  font-weight: 600;
}

.wx-info .wxname {
  font-size: 14px;
  color: #7f8c8d;
}

/* 切换按钮 */
.switch-btn {
  background: linear-gradient(135deg, #88CEE6, #64B5F6) !important;
  border: none !important;
  border-radius: 12px !important;
  padding: 10px 20px !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  color: white !important;
  min-width: 100px !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 2px 8px rgba(136, 206, 230, 0.3) !important;
}

.switch-btn:hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(136, 206, 230, 0.4) !important;
}

.switch-btn:disabled {
  background: #95a5a6 !important;
  cursor: not-allowed !important;
  transform: none !important;
  box-shadow: none !important;
}

/* 空状态提示 */
.empty-tip {
  text-align: center;
  color: #95a5a6;
  font-size: 16px;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
</style>
