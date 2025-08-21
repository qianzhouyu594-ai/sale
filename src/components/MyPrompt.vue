<template>
  <div class="prompt-container">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <button class="nav-back-btn" @click="goBackToDashboard">
        <span class="nav-back-icon">←</span>
        返回工作台
      </button>
      <div class="nav-title">销售话术配置</div>
      <div class="nav-subtitle">智能话术管理，提升销售效率</div>
      </div>

    <!-- 主要内容区域 -->
    <div class="main-container">
      <!-- 步骤导航 -->
      <div class="step-navigation" :data-current-step="currentStep">
        <div
          :class="['step-item', currentStep === 1 ? 'active' : '', currentStep > 1 ? 'completed' : '']"
          @click="goToStep(1)"
        >
          <div class="step-circle">1</div>
          <div class="step-label">选择策略</div>
        </div>
        <div class="step-connector" v-if="currentStep > 1"></div>
        <div
          :class="['step-item', currentStep === 2 ? 'active' : '', currentStep > 2 ? 'completed' : '']"
          @click="goToStep(2)"
        >
          <div class="step-circle">2</div>
          <div class="step-label">话术管理</div>
        </div>
        <div class="step-connector" v-if="currentStep > 2"></div>
        <div
          :class="['step-item', currentStep === 3 ? 'active' : '']"
          @click="goToStep(3)"
        >
          <div class="step-circle">3</div>
          <div class="step-label">策略配置</div>
        </div>
      </div>

      <!-- 步骤内容 -->
      <div class="step-content">
        <!-- 步骤1：选择策略 -->
        <div v-if="currentStep === 1" class="strategy-selection">
          <div class="selection-header">
            <h3>请选择您要配置的策略类型</h3>
            <p>不同的策略适用于不同的销售场景</p>
          </div>
          <div class="strategy-options">
            <div class="strategy-card" @click="radio1 = '实时策略'; goToStep(2)">
              <div class="strategy-icon">⚡</div>
              <div class="strategy-name">实时策略</div>
              <div class="strategy-desc">适用于即时销售场景</div>
          </div>
            <div class="strategy-card" @click="radio1 = '历史策略'; goToStep(2)">
              <div class="strategy-icon">📚</div>
              <div class="strategy-name">历史策略</div>
              <div class="strategy-desc">基于历史数据的优化策略</div>
        </div>
          </div>
        </div>

        <!-- 步骤2：话术管理 -->
        <div v-if="currentStep === 2" class="prompt-management">
          <div class="prompt-section">
            <div class="section-title">
              <span class="title-icon">✍️</span>
              话术输入与分析
            </div>
            <div class="prompt-input-area">
              <div class="input-group">
                <label>输入您的话术内容</label>
              <el-input
                type="textarea"
                v-model="textarea"
                  class="prompt-textarea"
                  :rows="8"
                  placeholder="请输入您要优化的销售话术..."
              />
            </div>
              
              <div class="result-group">
                <label>分析结果</label>
                <div v-if="loadingPolish" class="loading-container">
                  <div class="loading-spinner"></div>
                  <div class="loading-text">{{ loadingText }}</div>
              </div>
              <el-input
                v-else
                type="textarea"
                v-model="polishedText"
                  class="result-textarea"
                :rows="8"
                  placeholder="AI分析后的优化话术将在这里显示..."
                readonly
              />
            </div>
          </div>
            </div>

          <!-- 话术操作区域 -->
          <div class="prompt-actions">
            <div class="action-buttons">
              <button class="action-btn primary" @click="handleGet">
                <span class="btn-icon">📥</span>
                获取话术
              </button>
              <button class="action-btn secondary" @click="handleViewStrategy">
                <span class="btn-icon">⚙️</span>
                查看策略
              </button>
              <button class="action-btn analyze" :disabled="!textarea.trim()" @click="handleAnalyze">
                <span class="btn-icon">🔍</span>
                智能分析
              </button>
            </div>

          </div>
        </div>

        <!-- 步骤3：策略配置 -->
        <div v-if="currentStep === 3" class="strategy-config">
          <div class="config-header">
            <h3>配置策略条目</h3>
            <p>设置话术中的可配置参数和选项</p>
          </div>
          
          <div class="strategy-items">
            <div 
              class="strategy-item"
              v-for="(item, index) in itemCount"
              :key="index"
            >
              <div class="item-content">
                <div class="input-field identifier-field">
                <el-input
                  v-model="inputs1[index]"
                    placeholder="a"
                    class="identifier-input"
                />
                </div>
                <div class="input-field description-field">
                <el-input
                  v-model="inputs2[index]"
                    placeholder="如：具体产品名称"
                    class="description-input"
                  />
                </div>
                <button class="remove-item-btn" @click="removeRow(index)">删除</button>
          </div>
            </div>
          </div>

          <div class="config-controls">
            <div class="item-count-control">
              <label>条目数量：</label>
            <el-input-number
              v-model="itemCount"
                :min="1"
              :max="20"
                size="small"
                class="count-input"
            />
            </div>
            <button class="submit-btn" @click="handleSubmit">
              <span class="btn-icon">💾</span>
              保存配置
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'
import router from '@/router'
import { ArrowLeftBold, ArrowRightBold } from '@element-plus/icons-vue'

const userStore = useUserStore()
const user = computed(() => userStore.user)
const selectedWx = computed(() => userStore.selectedWx)

// 步骤指示器相关
const currentStep = ref(1) // 1: 选择策略, 2: 润色分析, 3: 配置策略
function goToStep(step: number) {
  currentStep.value = step
}

const textarea = ref('')
const itemCount = ref(0)
const inputs1 = ref<string[]>([])
const inputs2 = ref<string[]>([])
const checkboxes = ref<boolean[]>([])
const radio1 = ref('实时策略')
const polishedText = ref('')
const loadingPolish = ref(false) // 新增：润色区 loading 状态
const loadingText = ref('加载中，请稍候...') // 新增：loading 动画文本

const currentCacheIndex = ref(0)
const currentCacheArr = ref<any[]>([])

const showCacheNav = computed(() => currentCacheArr.value.length > 1)

function updateFromCache(index: number) {
  if (currentCacheArr.value.length === 0) return
  const item = currentCacheArr.value[index]
  textarea.value = item.prompt // 仅更新左侧文本域
  polishedText.value = '' // 清空右侧文本域
}

function handlePrevCache() {
  if (currentCacheArr.value.length === 0) return
  if (currentCacheIndex.value > 0) {
    currentCacheIndex.value--
    updateFromCache(currentCacheIndex.value)
  }
}
function handleNextCache() {
  if (currentCacheArr.value.length === 0) return
  if (currentCacheIndex.value < currentCacheArr.value.length - 1) {
    currentCacheIndex.value++
    updateFromCache(currentCacheIndex.value)
  }
}
// 修改handleViewStrategy，使其更智能
function handleViewStrategy() {
  if (currentCacheArr.value.length === 0) return
  
  // 跳转到第三步并显示当前指令的策略条目
  const item = currentCacheArr.value[currentCacheIndex.value]
  let letterDescArray = item.letter_desc_array || []
  
  // 清空现有数据
  inputs1.value = []
  inputs2.value = []
  checkboxes.value = []
  
  if (letterDescArray.length > 0) {
    // 如果有策略条目，直接填充
  letterDescArray.forEach((item: any, index: number) => {
    if (item && typeof item === 'object') {
      inputs1.value.push(item.key || `item${index + 1}`)
      inputs2.value.push(item.name || '')
      checkboxes.value.push(Boolean(item.select_enable))
    }
  })
  itemCount.value = letterDescArray.length
  currentStep.value = 3
    ElMessage.success('已跳转到策略配置步骤')
  } else {
    // 如果没有策略条目，提示用户
    ElMessage.warning('当前话术没有配置策略条目，请先进行分析')
  }
}

// 本地缓存工具函数
function getPromptCacheKey(username: string, wxid: string, strategy: string) {
  return `prompt_cache_${username}_${wxid}_${strategy}`
}
function loadPromptCache(username: string, wxid: string, strategy: string) {
  const key = getPromptCacheKey(username, wxid, strategy)
  const arr = localStorage.getItem(key)
  return arr ? JSON.parse(arr) : []
}
function savePromptCache(
  username: string,
  wxid: string,
  strategy: string,
  prompt: string,
  letterDescArray: any[],
) {
  const key = getPromptCacheKey(username, wxid, strategy)
  let arr = loadPromptCache(username, wxid, strategy)
  // 查找是否有相同prompt
  const idx = arr.findIndex(
    (item: { prompt: string; letter_desc_array: any[]; timestamp: number }) =>
      item.prompt === prompt,
  )
  if (idx !== -1) {
    // 有相同内容，更新策略条目和时间戳，移到最前面
    arr[idx].letter_desc_array = letterDescArray
    arr[idx].timestamp = Date.now()
    const updated = arr.splice(idx, 1)[0]
    arr.unshift(updated)
  } else {
    // 没有相同内容，插入新记录
    arr.unshift({ prompt, letter_desc_array: letterDescArray, timestamp: Date.now() })
    if (arr.length > 5) arr = arr.slice(0, 5)
  }
  localStorage.setItem(key, JSON.stringify(arr))
}

const serverUrl = '/api'
const analyzeUrl = '/analyze'  // 修改为正确的分析接口

watch(itemCount, (newVal) => {
  while (inputs1.value.length < newVal) {
    const idx = inputs1.value.length
    const letter = String.fromCharCode(97 + idx)
    inputs1.value.push(letter)
    inputs2.value.push('')
    checkboxes.value.push(false)
  }
  while (inputs1.value.length > newVal) {
    inputs1.value.pop()
    inputs2.value.pop()
    checkboxes.value.pop()
  }
  reorderLetters()
})

watch(loadingPolish, (val) => {
  if (val) {
    // 动态 loading 动画
    let dotCount = 0
    const interval = setInterval(() => {
      if (!loadingPolish.value) {
        clearInterval(interval)
        return
      }
      dotCount = (dotCount + 1) % 4
      loadingText.value = '加载中，请稍候' + '.'.repeat(dotCount)
    }, 500)
  } else {
    loadingText.value = '加载中，请稍候...'
  }
})

const goBackToDashboard = () => {
  console.log('点击了返回工作台')
  router.push('/dashboard')
}

const handleGet = async () => {
  const strategy = radio1.value === '实时策略' ? 'realtime' : 'history'
  if (!user.value || !user.value.username || !user.value.password) {
    ElMessage.error('请先登录！')
    return
  }
  if (!selectedWx.value || !selectedWx.value.wxid) {
    ElMessage.error('请先选择微信账号！')
    return
  }

  // 优先本地缓存
  const cacheArr = loadPromptCache(user.value.username, selectedWx.value.wxid, strategy)
  if (cacheArr.length > 0) {
    currentCacheArr.value = cacheArr
    currentCacheIndex.value = 0
    updateFromCache(0)
    currentStep.value = 2
    ElMessage.success('已从本地缓存读取！')
    return
  }

  try {
    const response = await fetch(`/getprompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: user.value.username,
        password: user.value.password,
        strategy: strategy,
        wxid: selectedWx.value.wxid,
      }),
    })

    if (response.ok) {
      try {
        const data = await response.json()
        if (data.state === 'success') {
          textarea.value = data.prompt_info || ''
          polishedText.value = ''
          
          // 如果有策略条目，保存到缓存但不自动跳转
          if (data.letter_desc_array && data.letter_desc_array.length > 0) {
            // 将获取的数据保存到缓存中，供"查看策略"按钮使用
            currentCacheArr.value = [{
              prompt: data.prompt_info,
              letter_desc_array: data.letter_desc_array,
              timestamp: Date.now()
            }]
            currentCacheIndex.value = 0
            
            ElMessage.success('获取成功！点击"查看策略"按钮可查看和配置策略条目')
          } else {
            // 如果没有策略条目，清空缓存
            currentCacheArr.value = []
            ElMessage.success('获取成功！当前话术没有配置策略条目，请点击"分析"按钮进行话术优化')
          }
        } else {
          ElMessage.warning(data.msg || '获取失败')
        }
      } catch (jsonError) {
        ElMessage.warning('服务器返回非JSON格式数据，请检查服务器配置')
      }
    } else {
      ElMessage.error(`获取失败: ${response.statusText}`)
    }
  } catch (error) {
    ElMessage.error(`请求出错: ${error}`)
  }
}

const handleSubmit = async () => {
  if (!textarea.value.trim()) {
    ElMessage.warning('请输入大模型提示信息')
    return
  }
  if (!selectedWx.value || !selectedWx.value.wxid) {
    ElMessage.error('请先选择微信账号！')
    return
  }
  const strategy = radio1.value === '实时策略' ? 'realtime' : 'history'
  const letterDescArray = []
  for (let i = 0; i < inputs1.value.length; i++) {
    const letter = inputs1.value[i].trim()
    if (letter) {
      letterDescArray.push({
        key: letter,
        name: inputs2.value[i].trim(),
        select_enable: checkboxes.value[i] ? 1 : 0,
      })
    }
  }
  
  // 提交前先存本地
  savePromptCache(
    user.value.username,
    selectedWx.value.wxid,
    strategy,
    textarea.value.trim(),
    letterDescArray,
  )
  
  try {
    const response = await fetch(`/submitprompt`, {  // 修改为正确的接口路径
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: user.value.username,
        password: user.value.password,
        strategy: strategy,
        wxid: selectedWx.value.wxid,
        prompt_info: textarea.value.trim(),
        letter_desc_array: letterDescArray,
      }),
    })
    
    if (response.ok) {
      try {
        const data = await response.json()
        if (data.state === 'success') {
        ElMessage.success('提交成功！')
          // 提交成功后可以跳转回第一步或显示成功提示
        } else {
          ElMessage.warning(data.msg || '提交失败')
        }
      } catch (jsonError) {
        ElMessage.success('提交成功！')
      }
    } else {
      ElMessage.error(`提交失败: ${response.statusText}`)
    }
  } catch (error) {
    ElMessage.error(`请求出错: ${error}`)
  }
}

const removeRow = (index: number) => {
  if (itemCount.value > 0) {
    inputs1.value.splice(index, 1)
    inputs2.value.splice(index, 1)
    checkboxes.value.splice(index, 1)
    itemCount.value--
    reorderLetters()
  }
}

const reorderLetters = () => {
  for (let i = 0; i < inputs1.value.length; i++) {
    const newLetter = String.fromCharCode(97 + i)
    inputs1.value[i] = newLetter
  }
}

// 修改handleAnalyze，分析成功后自动跳转到第三步
const handleAnalyze = async () => {
  if (!textarea.value.trim()) {
    ElMessage.warning('请输入需要分析的信息')
    return
  }
  if (!selectedWx.value || !selectedWx.value.wxid) {
    ElMessage.error('请先选择微信账号！')
    return
  }
  const strategy = radio1.value === '实时策略' ? 'realtime' : 'history'
  loadingPolish.value = true
  polishedText.value = ''
  
  try {
    const response = await fetch(`/analyze`, {  // 修改为正确的分析大模型接口，这里就不调用了，后端编写接口就行
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: user.value.username,
        password: user.value.password,
        strategy: strategy,
        wxid: selectedWx.value.wxid,
        prompt_info: textarea.value.trim(),
      }),
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.state === 'success') {
      if (data.prompt_new) {
        polishedText.value = data.prompt_new
      } else if (data.new_prompt) {
        polishedText.value = data.new_prompt
      } else if (data.polished_text) {
        polishedText.value = data.polished_text
      } else {
          polishedText.value = '分析完成，但未返回优化后的话术'
      }
        
        // 处理策略条目
      if (data.dict && typeof data.dict === 'object') {
        const keys = Object.keys(data.dict)
        inputs1.value = []
        inputs2.value = []
        checkboxes.value = []
        keys.forEach((key, idx) => {
          inputs1.value.push(key)
          inputs2.value.push(data.dict[key] || '')
          checkboxes.value.push(true)
        })
        itemCount.value = keys.length
      } else {
          // 如果没有返回策略条目，清空现有数据
        inputs1.value = []
        inputs2.value = []
        checkboxes.value = []
        itemCount.value = 0
      }
        
      ElMessage.success('分析成功！')
      // 分析成功后自动跳转到第三步
      currentStep.value = 3
      } else {
        ElMessage.warning(data.msg || '分析失败')
      }
    } else {
      const errorText = await response.text()
      ElMessage.error(`分析失败: ${errorText}`)
    }
  } catch (error) {
    ElMessage.error(`分析请求出错: ${error}`)
  } finally {
    loadingPolish.value = false
  }
}
</script>

<style scoped>
/* 主容器样式 */
.prompt-container {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding-top: 80px;
}

/* 顶部导航栏 */
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  z-index: 100;
  display: flex;
  align-items: center;
  padding: 20px 30px;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
}

.nav-back-btn {
  background: transparent;
  color: #88CEE6;
  border: 2px solid #88CEE6;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-back-btn:hover {
  background: linear-gradient(135deg, #88CEE6, #64B5F6);
  color: white;
  transform: translateY(-1px);
}

.nav-back-icon {
  font-size: 16px;
  font-weight: bold;
}

.nav-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  flex-grow: 1;
  text-align: center;
  background: linear-gradient(135deg, #1e293b, #475569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-subtitle {
  font-size: 14px;
  color: #64748b;
  margin-top: 4px;
  text-align: center;
}

/* 主内容容器 */
.main-container {
  width: 1000px;
  min-width: 300px;
  padding: 40px;
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(226, 232, 240, 0.8);
  overflow: hidden;
  display: block;
}

/* 步骤导航 */
.step-navigation {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 20px;
  padding: 24px 32px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.6);
  position: relative;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  flex: 1;
  min-width: 0;
}

.step-item.active {
  color: #88CEE6;
  font-weight: 600;
}

.step-item.completed {
  color: #88CEE6;
  font-weight: 600;
}

/* 步骤圆圈 */
.step-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.step-item.active .step-circle {
  background: linear-gradient(135deg, #88CEE6, #64B5F6);
  color: white;
  box-shadow: 0 4px 15px rgba(136, 206, 230, 0.3);
  transform: scale(1.1);
}

.step-item.completed .step-circle {
  background: linear-gradient(135deg, #88CEE6, #64B5F6);
  color: white;
  box-shadow: 0 2px 10px rgba(136, 206, 230, 0.2);
}

/* 步骤标签 */
.step-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
  text-align: center;
}

.step-item.active .step-label,
.step-item.completed .step-label {
  color: #88CEE6;
  font-weight: 600;
}

/* 连接线 - 使用伪元素创建，不影响布局 */
.step-navigation::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 25%;
  right: 25%;
  height: 3px;
  background: #e2e8f0;
  transform: translateY(-50%);
  border-radius: 2px;
  z-index: 1;
}

.step-navigation::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 25%;
  height: 3px;
  background: linear-gradient(90deg, #88CEE6, #64B5F6);
  border-radius: 2px;
  transform: translateY(-50%);
  transition: width 0.5s ease;
  width: 0;
  z-index: 1;
}

/* 根据当前步骤调整进度条宽度 */
.step-navigation[data-current-step="2"]::after {
  width: 25%;
}

.step-navigation[data-current-step="3"]::after {
  width: 50%;
}

/* 步骤内容 */
.step-content {
  width: 100%;
  padding: 0;
}

/* 策略选择区域 */
.strategy-selection {
  text-align: center;
  padding: 40px 0;
}

.selection-header h3 {
  font-size: 28px;
  color: #1e293b;
  margin-bottom: 12px;
  font-weight: 700;
  background: linear-gradient(135deg, #1e293b, #475569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.selection-header p {
  font-size: 16px;
  color: #64748b;
  margin-bottom: 40px;
  line-height: 1.6;
}

.strategy-options {
  display: flex;
  justify-content: center;
  gap: 30px;
  max-width: 800px;
  margin: 0 auto;
}

.strategy-card {
  flex: 1;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
  backdrop-filter: blur(20px);
  border: 2px solid rgba(136, 206, 230, 0.2);
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  position: relative;
  overflow: hidden;
}

.strategy-card::before {
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

.strategy-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(136, 206, 230, 0.15);
  border-color: rgba(136, 206, 230, 0.4);
}

.strategy-card:hover::before {
  transform: scaleX(1);
}

.strategy-icon {
  font-size: 56px;
  margin-bottom: 20px;
  color: #88CEE6;
}

.strategy-name {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
  line-height: 1.3;
}

.strategy-desc {
  font-size: 15px;
  color: #64748b;
  line-height: 1.6;
}

/* 话术管理区域 */
.prompt-management {
  padding: 5px 0;
}

.prompt-section {
  margin-bottom: 40px;
}

.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  background: linear-gradient(135deg, #1e293b, #475569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-title .title-icon {
  font-size: 28px;
  margin-right: 12px;
  color: #88CEE6;
}

.prompt-input-area {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 表单标签 */
.input-group label {
  font-size: 16px;
  color: #374151;
  font-weight: 600;
  margin-bottom: 8px;
}

/* 输入框样式 */
.prompt-textarea {
  width: 100%;
  min-width: 300px;
  max-width: 1100px;
  height: 250px;
  padding: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  font-size: 16px;
  line-height: 1.6;
  resize: none;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  font-family: inherit;
}

.prompt-textarea:focus {
  border-color: #88CEE6;
  box-shadow: 0 4px 20px rgba(136, 206, 230, 0.15);
  outline: none;
  background: white;
}



/* 结果区域 */
.result-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-group label {
  font-size: 16px;
  color: #374151;
  font-weight: 600;
}

/* 加载容器 */
.loading-container {
  width: 100%;
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 2px solid rgba(136, 206, 230, 0.2);
  box-sizing: border-box;
}

/* 加载动画 */
.loading-spinner {
  border: 4px solid rgba(136, 206, 230, 0.2);
  border-top: 4px solid #88CEE6;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 16px;
  color: #64748b;
  font-weight: 500;
}

/* 结果文本框 */
.result-textarea {
  width: 100%;
  min-width: 300px;
  max-width: 1100px;
  height: 250px;
  padding: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  font-size: 16px;
  line-height: 1.6;
  resize: none;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  font-family: inherit;
}

.result-textarea:focus {
  border-color: #88CEE6;
  box-shadow: 0 4px 20px rgba(136, 206, 230, 0.15);
  outline: none;
  background: white;
}

/* 操作按钮区域 */
.prompt-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  padding: 0;
}

.action-buttons {
  display: flex;
  gap: 16px;
}

.action-btn {
  padding: 12px 28px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  border: none;
}

.action-btn.primary {
  background: linear-gradient(135deg, #88CEE6, #64B5F6);
  color: white;
  box-shadow: 0 4px 15px rgba(136, 206, 230, 0.3);
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(136, 206, 230, 0.4);
}

.action-btn.secondary {
  background: rgba(136, 206, 230, 0.1);
  color: #88CEE6;
  border: 2px solid rgba(136, 206, 230, 0.3);
  box-shadow: 0 2px 10px rgba(136, 206, 230, 0.1);
}

.action-btn.secondary:hover {
  background: rgba(136, 206, 230, 0.15);
  border-color: rgba(136, 206, 230, 0.5);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(136, 206, 230, 0.2);
}

.action-btn.analyze {
  background: linear-gradient(135deg, #1fac7d, #6ee6c0);
  color: white;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.action-btn.analyze:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.action-btn.analyze:disabled {
  background: #94a3b8;
  color: #e2e8f0;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.action-btn .btn-icon {
  font-size: 18px;
}



/* 策略配置区域 */
.strategy-config {
  padding: 10px 0;
}

.config-header {
  margin-bottom: 32px;
  text-align: center;
}

.config-header h3 {
  font-size: 28px;
  color: #1e293b;
  margin-bottom: 12px;
  font-weight: 700;
  background: linear-gradient(135deg, #1e293b, #475569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.config-header p {
  font-size: 16px;
  color: #64748b;
  margin-bottom: 32px;
  line-height: 1.6;
}

/* 策略配置项 */
.strategy-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;
}

.strategy-item {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
  backdrop-filter: blur(10px);
  border: 2px solid rgba(136, 206, 230, 0.2);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  transition: all 0.3s ease;
}

.strategy-item:hover {
  border-color: rgba(136, 206, 230, 0.4);
  box-shadow: 0 4px 20px rgba(136, 206, 230, 0.1);
}

.item-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.remove-item-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  min-width: 70px;
}

.remove-item-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.item-content {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-grow: 1;
  width: 100%;
}

.input-field {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.identifier-field {
  flex: 0 0 120px; /* 固定宽度120px，不伸缩 */
}

.description-field {
  flex: 2; /* 占用2倍的剩余空间 */
  min-width: 200px;
}

/* 输入框样式 */
.identifier-input {
  width: 100%;
  height: 60px;
  padding: 8px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 20px;
  text-align: center;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.identifier-input:focus {
  border-color: #88CEE6;
  box-shadow: 0 4px 15px rgba(136, 206, 230, 0.15);
  outline: none;
  background: white;
}

.description-input {
  width: 100%;
  height: 60px;
  padding: 8px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.description-input:focus {
  border-color: #88CEE6;
  box-shadow: 0 4px 15px rgba(136, 206, 230, 0.15);
  outline: none;
  background: white;
}

.checkbox-field {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  min-width: 140px;
}

/* 配置控制区域 */
.config-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  padding: 0;
}

.item-count-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.item-count-control label {
  font-size: 16px;
  color: #374151;
  font-weight: 600;
}

.count-input {
  width: 140px;
  height: 44px;
  flex-shrink: 0;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.count-input:focus {
  border-color: #88CEE6;
  box-shadow: 0 4px 15px rgba(136, 206, 230, 0.15);
  outline: none;
  background: white;
}

/* 提交按钮 */
.submit-btn {
  padding: 12px 28px;
  background: linear-gradient(135deg, #88CEE6, #64B5F6);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(136, 206, 230, 0.3);
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(136, 206, 230, 0.4);
}

.submit-btn .btn-icon {
  font-size: 18px;
}

.button-group {
  margin-left: auto;
  display: flex;
  gap: 12px;
}

.input-number-control {
  width: 140px;
  height: 44px;
  flex-shrink: 0;
  margin-top: 0;
  margin-bottom: 0;
}
/* 响应式设计 */
@media (max-width: 768px) {
  .prompt-container {
    padding-top: 70px;
  }

  .top-nav {
    padding: 16px 20px;
  }

  .nav-title {
    font-size: 20px;
  }

  .nav-subtitle {
    font-size: 13px;
  }

  .main-container {
    width: 95vw;
    min-width: 320px;
    padding: 24px;
    margin-top: 16px;
  }

  .step-navigation {
    padding: 20px 24px;
    gap: 12px;
  }

  .step-item {
    flex: 1;
    text-align: center;
  }

  .step-circle {
    width: 40px;
    height: 40px;
    font-size: 14px;
  }

  .step-label {
    font-size: 12px;
  }

  .step-connector {
    margin: 0 8px;
  }
  .strategy-selection {
    padding: 32px 0;
  }

  .selection-header h3 {
    font-size: 24px;
  }

  .selection-header p {
    font-size: 15px;
  }

  .strategy-options {
    flex-direction: column;
    gap: 20px;
  }

  .strategy-card {
    padding: 32px 20px;
    min-height: 200px;
  }

  .strategy-icon {
    font-size: 48px;
  }

  .strategy-name {
    font-size: 20px;
  }

  .strategy-desc {
    font-size: 14px;
  }

  .prompt-management {
    padding: 32px 0;
  }

  .prompt-input-area {
    gap: 20px;
  }

  .input-group {
    gap: 10px;
  }

  .input-group label {
    font-size: 15px;
  }

  .prompt-textarea {
    height: 220px;
    padding: 16px;
  }


  .result-group {
    gap: 12px;
  }

  .result-group label {
    font-size: 15px;
  }

  .loading-container {
    height: 220px;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
  }

  .loading-text {
    font-size: 15px;
  }

  .result-textarea {
    height: 220px;
    padding: 16px;
  }

  .prompt-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    margin-top: 32px;
  }

  .action-buttons {
    width: 100%;
    justify-content: space-between;
    gap: 12px;
  }

  .action-btn {
    flex: 1;
    padding: 12px 20px;
    font-size: 15px;
  }

  .action-btn .btn-icon {
    font-size: 16px;
  }


  .strategy-config {
    padding: 32px 0;
  }

  .config-header {
    margin-bottom: 24px;
  }

  .config-header h3 {
    font-size: 24px;
  }

  .config-header p {
    font-size: 15px;
  }

  .strategy-items {
    gap: 16px;
    margin-bottom: 24px;
  }

  .strategy-item {
    padding: 20px;
    gap: 16px;
    flex-direction: column;
    align-items: stretch;
  }

  .item-content {
    gap: 16px;
    flex-direction: column;
  }

  .identifier-field {
    flex: none;
  }

  .description-field {
    flex: none;
    min-width: auto;
  }

  .identifier-input {
    height: 44px;
    padding: 12px 16px;
    font-size: 15px;
  }

  .description-input {
    height: 44px;
    padding: 12px 16px;
    font-size: 15px;
  }

  .remove-item-btn {
    padding: 10px 16px;
    font-size: 14px;
    min-width: 80px;
    align-self: center;
  }

  .checkbox-field {
    gap: 10px;
    min-width: auto;
    justify-content: center;
  }

  .config-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
  }

  .item-count-control {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .item-count-control label {
    font-size: 15px;
  }

  .count-input {
    width: 100%;
  }

  .submit-btn {
    width: 100%;
    padding: 12px 24px;
    font-size: 16px;
  }

  .submit-btn .btn-icon {
    font-size: 16px;
  }
}
</style>
