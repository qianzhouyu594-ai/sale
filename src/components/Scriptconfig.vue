<template>
  <div class="script-container">
    <!-- 顶部导航栏 -->
    <div class="top-nav">
      <button class="nav-back-btn" @click="goBackToDashboard">
        <span class="nav-back-icon">←</span>
        返回工作台
      </button>
      <div class="nav-title">问答话术知识库</div>
      <div class="nav-subtitle">智能话术管理，提升沟通效率</div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-container">
      <!-- 操作区域 -->
      <div class="action-section">
        <div class="section-header">
          <h2>📚 话术场景管理</h2>
          <p>管理各种销售场景的话术模板</p>
        </div>
        <div class="action-buttons">
          <button class="action-btn primary" @click="showAddModal">
            <span class="btn-icon">➕</span>
            新增话术
          </button>
          <button class="action-btn secondary" @click="refreshData">
            <span class="btn-icon">🔄</span>
            刷新数据
          </button>
        </div>
      </div>

      <!-- 话术列表 -->
      <div class="script-list">
        <div v-if="scriptList.length > 0" class="list-content">
          <div 
            v-for="(item, index) in scriptList" 
            :key="item.id" 
            class="script-card"
            :class="{ 'special-item': item.sceneNo === 'S01' }"
          >
            <div class="card-header">
              <div class="scene-info">
                <div class="scene-number">
                  <span v-if="item.sceneNo === 'S01'" class="special-icon">⭐</span>
                  {{ item.sceneNo }} {{ item.sceneDesc }}
                </div>
              </div>
              <div class="card-actions">
                <button 
                  class="action-icon edit-icon" 
                  :disabled="item.sceneNo === 'S01'"
                  :title="item.sceneNo === 'S01' ? '破冰话术不可编辑' : '编辑'"
                  @click="editScript(index)"
                >
                  ✏️
                </button>
                <button 
                  class="action-icon delete-icon" 
                  @click="confirmDelete(index)"
                  title="删除"
                >
                  🗑️
                </button>
              </div>
            </div>

            <div class="card-content">
              <div class="keyword-section">
                <span class="keyword-label">关键词：</span>
                <span class="keyword-text">{{ item.keyword}}</span>
              </div>
              
              <div class="speech-section">
                <div class="speech-item">
                  <div class="speech-header">
                    <span class="speech-icon">📝</span>
                    <span class="speech-title">标准话术</span>
                  </div>
                  <div class="speech-content">{{ item.speeches.standard }}</div>
                </div>
                
                <div class="speech-item">
                  <div class="speech-header">
                    <span class="speech-icon">💬</span>
                    <span class="speech-title">口语化话术</span>
                  </div>
                  <div class="speech-content">{{ item.speeches.colloquial }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="empty-state">
          <div class="empty-icon">📝</div>
          <h3>暂无话术场景</h3>
          <p>点击"新增场景"按钮开始创建您的话术模板</p>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-section">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="totalScripts"
          layout="prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <!-- 新增/编辑模态框 -->
    <el-dialog 
      v-model="showModal" 
      :title="modalTitle" 
      width="60%"
      class="script-modal"
    >
      <div class="modal-content">
        <div class="form-group">
          <label class="form-label">问题描述 <span class="required">*</span></label>
          <el-input 
            v-model="currentScript.sceneDesc" 
            placeholder="请输入问题描述，如：客户咨询产品价格"
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">关键词</label>
          <el-input 
            v-model="currentScript.keyword" 
            placeholder="请输入关键词，如：产品价格,咨询"
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">标准话术 <span class="required">*</span></label>
          <el-input 
            v-model="currentScript.speeches.standard" 
            type="textarea" 
            :rows="3" 
            placeholder="请输入标准话术内容"
            class="form-textarea"
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">口语化话术 <span class="required">*</span></label>
          <el-input 
            v-model="currentScript.speeches.colloquial" 
            type="textarea" 
            :rows="3" 
            placeholder="请输入口语化话术内容"
            class="form-textarea"
          />
        </div>
      </div>
      
      <template #footer>
        <div class="modal-footer">
          <button class="modal-btn cancel" @click="showModal = false">取消</button>
          <button class="modal-btn confirm" @click="saveScript">保存</button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'

// 话术场景接口
interface ScriptItem {
  id: string
  sceneNo: string
  sceneDesc: string
  keyword: string
  speeches: {
    standard: string
    colloquial: string
  }
}

const router = useRouter()
const userStore = useUserStore()

// 响应式数据
const scriptList = ref<ScriptItem[]>([])
const currentScript = ref<ScriptItem>({
  id: '',
  sceneNo: '',
  sceneDesc: '',
  keyword: '',
  speeches: { standard: '', colloquial: '' }
})
const showModal = ref(false)
const modalTitle = ref('新增场景')
const editingIndex = ref(-1)
const currentPage = ref(1)
const pageSize = ref(10)
const totalScripts = ref(0)

// 本地存储键名
const STORAGE_KEY = 'script_config_data'

// 从本地存储加载数据
const loadFromLocalStorage = (): ScriptItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('加载本地存储失败:', error)
    return []
  }
}

// 保存到本地存储
const saveToLocalStorage = (data: ScriptItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('保存到本地存储失败:', error)
  }
}

// 加载话术列表
const loadScriptList = async () => {
  try {
    // 1. 从后端获取破冰话术
    let icebreakerItem: ScriptItem | null = null
    try {
      const response = await fetch('/auth/get_icebreaker')
      const data = await response.json()
      if (data.state === 'success' && Array.isArray(data.data) && data.data.length > 0) {
        // 现在后端返回结构化对象数组
        const ice = data.data[0]
        icebreakerItem = {
          id: ice.id?.toString() || 'S01',
          sceneNo: 'S01',
          sceneDesc: ice.question,
          keyword: ice.keyword,
          speeches: {
            standard: ice.script1 || '您好，很高兴认识您！',
            colloquial: ice.script2 || '嗨，很高兴认识您！',
          },
        }
      }
    } catch (error) {
      console.error('获取破冰话术失败:', error)
    }

    // 2. 从后端获取其他话术数据
    let backendScripts: ScriptItem[] = []
    try {
      const response = await fetch('/auth/queryall_qa_data_main', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userStore.user?.username || 'admin',
          page: currentPage.value,
          size: pageSize.value,
        }),
      })
      const data = await response.json()
      if (data.state === 'success' && Array.isArray(data.data)) {
        backendScripts = data.data.map((item: any, index: number) => ({
          id: item.id?.toString() || `item_${Date.now()}_${index}`,
          sceneNo: `S${String(index + 2).padStart(2, '0')}`,
          sceneDesc: item.question || '',
          keyword: item.keyword || '',
          speeches: {
            standard: item.script1 || '',
            colloquial: item.script2 || '',
          },
        }))
      }
    } catch (error) {
      console.error('获取后端数据失败:', error)
    }

    // 3. 从本地存储获取数据
    const localScripts = loadFromLocalStorage()

    // 4. 合并数据：破冰话术 + 后端数据 + 本地数据
    const allScripts = []
    if (icebreakerItem) allScripts.push(icebreakerItem)
    allScripts.push(...backendScripts)
    allScripts.push(...localScripts)

    // 5. 分页处理
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    scriptList.value = allScripts.slice(start, end)
    totalScripts.value = allScripts.length

  } catch (error) {
    console.error('加载话术列表失败:', error)
    ElMessage.error('加载数据失败')
  }
}

// 页面加载时获取数据
onMounted(() => {
  loadScriptList()
})

// 页面变化处理
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadScriptList()
}

// 返回工作台
const goBackToDashboard = () => {
  router.push('/dashboard')
}

// 刷新数据
const refreshData = () => {
  loadScriptList()
  ElMessage.success('数据已刷新')
}

// 显示新增模态框
const showAddModal = () => {
  currentScript.value = {
    id: `local_${Date.now()}`,
    sceneNo: '',
    sceneDesc: '',
    keyword: '',
    speeches: { standard: '', colloquial: '' }
  }
  modalTitle.value = '新增场景'
  editingIndex.value = -1
  showModal.value = true
}

// 编辑话术
const editScript = (index: number) => {
  const item = scriptList.value[index]
  if (item.sceneNo === 'S01') {
    ElMessage.info('破冰话术不可编辑')
    return
  }
  
  currentScript.value = JSON.parse(JSON.stringify(item))
  modalTitle.value = '编辑场景'
  editingIndex.value = index
  showModal.value = true
}

// 确认删除
const confirmDelete = async (index: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这条话术吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    deleteScript(index)
  } catch {
    ElMessage.info('已取消删除')
  }
}

// 删除话术
const deleteScript = (index: number) => {
  const item = scriptList.value[index]
  
  // 如果是本地数据，从本地存储中删除
  if (item.id.startsWith('local_')) {
    const localScripts = loadFromLocalStorage()
    const updatedLocalScripts = localScripts.filter(s => s.id !== item.id)
    saveToLocalStorage(updatedLocalScripts)
  }
  
  // 从页面列表中删除
  scriptList.value.splice(index, 1)
  totalScripts.value--
  
  ElMessage.success('删除成功')
}

// 保存话术
const saveScript = () => {
  // 验证必填字段
  if (!currentScript.value.sceneDesc.trim()) {
    ElMessage.warning('请填写场景描述')
    return
  }
  if (!currentScript.value.speeches.standard.trim() || !currentScript.value.speeches.colloquial.trim()) {
    ElMessage.warning('请填写两种话术')
    return
  }

  try {
    if (editingIndex.value >= 0) {
      // 编辑模式
      const item = scriptList.value[editingIndex.value]
      if (item.id.startsWith('local_')) {
        // 更新本地存储
        const localScripts = loadFromLocalStorage()
        const index = localScripts.findIndex(s => s.id === item.id)
        if (index >= 0) {
          localScripts[index] = { ...currentScript.value }
          saveToLocalStorage(localScripts)
        }
      }
      
      // 更新页面显示
      scriptList.value[editingIndex.value] = { ...currentScript.value }
      ElMessage.success('更新成功')
    } else {
      // 新增模式
      const newScript = { ...currentScript.value }
      
      // 保存到本地存储
      const localScripts = loadFromLocalStorage()
      localScripts.push(newScript)
      saveToLocalStorage(localScripts)
      
      // 添加到页面显示
      scriptList.value.push(newScript)
      totalScripts.value++
      ElMessage.success('添加成功')
    }
    
    showModal.value = false
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  }
}
</script>

<style scoped>
/* 使用指定的四种颜色 */
:root {
  --color-pink: #E89DA0;
  --color-blue: #88CEE6;
  --color-orange: #F6C8A8;
  --color-green: #B2D3A8;
}

.script-container {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding-top: 80px;
}

.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(135deg, var(--color-blue) 0%, var(--color-green) 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: flex;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.nav-back-btn {
  background:  #e0e0e0;
  color: black;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(10px);
}

.nav-back-btn:hover {
  background: #d0d0d0;
  transform: translateY(-2px);
}

.nav-back-icon {
  font-size: 18px;
  font-weight: bold;
}

.nav-title {
  font-size: 24px;
  font-weight: bold;
  color: black;
  flex-grow: 1;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-subtitle {
  font-size: 16px;
  color: black;
  margin-top: 4px;
}

.main-container {
  width: 100%;
  max-width: 1200px;
  padding: 30px 20px;
  margin-top: 20px;
}

.action-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.section-header h2 {
  font-size: 28px;
  color: #2c3e50;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-header p {
  font-size: 16px;
  color: #7f8c8d;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.action-btn {
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.action-btn.primary {
  background: linear-gradient(135deg, var(--color-green) 0%, var(--color-blue) 100%);
  color: black;
}

.action-btn.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.action-btn.secondary {
  background: linear-gradient(135deg, var(--color-orange) 0%, var(--color-pink) 100%);
  color: black;
}

.action-btn.secondary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.btn-icon {
  font-size: 18px;
}

.script-list {
  margin-bottom: 30px;
}

.list-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.script-card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border-left: 6px solid var(--color-blue);
}

.script-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
}

.script-card.special-item {
  border-left-color: var(--color-orange);
  background: linear-gradient(135deg, #fff9f0 0%, #fff 100%);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.scene-info {
  flex: 1;
}

.scene-number {
  font-size: 20px;
  font-weight: bold;
  color: var(--color-blue);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.special-icon {
  font-size: 24px;
  color: var(--color-orange);
}

.scene-desc {
  font-size: 18px;
  color: #2c3e50;
  font-weight: 600;
}

.card-actions {
  display: flex;
  gap: 10px;
}

.action-icon {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.edit-icon {
  color: var(--color-blue);
}

.edit-icon:hover:not(:disabled) {
  background: rgba(136, 206, 230, 0.1);
  transform: scale(1.1);
}

.edit-icon:disabled {
  color: #bdc3c7;
  cursor: not-allowed;
}

.delete-icon {
  color: var(--color-pink);
}

.delete-icon:hover {
  background: rgba(232, 157, 160, 0.1);
  transform: scale(1.1);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.keyword-section {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, var(--color-green) 0%, var(--color-blue) 100%);
  border-radius: 10px;
  color: black;
}

.keyword-label {
  font-weight: 600;
  font-size: 14px;
}

.keyword-text {
  font-size: 14px;
  opacity: 0.9;
}

.speech-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.speech-item {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid var(--color-green);
}

.speech-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.speech-icon {
  font-size: 20px;
}

.speech-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.speech-content {
  color: #34495e;
  line-height: 1.6;
  white-space: pre-line;
  font-size: 14px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.6;
}

.empty-state h3 {
  font-size: 24px;
  color: #2c3e50;
  margin: 0 0 10px 0;
}

.empty-state p {
  font-size: 16px;
  color: #7f8c8d;
  margin: 0;
}

.pagination-section {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

/* 模态框样式 */
.script-modal {
  border-radius: 20px;
}

.modal-content {
  padding: 20px 0;
}

.form-group {
  margin-bottom: 25px;
}

.form-label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.required {
  color: #e74c3c;
}

.form-input,
.form-textarea {
  width: 100%;
  border: 2px solid #ecf0f1;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--color-blue);
  box-shadow: 0 0 0 3px rgba(136, 206, 230, 0.1);
  outline: none;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding-top: 20px;
}

.modal-btn {
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
}

.modal-btn.cancel {
  background: #ecf0f1;
  color: #7f8c8d;
}

.modal-btn.cancel:hover {
  background: #d5dbdb;
}

.modal-btn.confirm {
  background: linear-gradient(135deg, var(--color-green) 0%, var(--color-blue) 100%);
  color: black;
}

.modal-btn.confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .script-container {
    padding-top: 60px;
  }
  
  .top-nav {
    padding: 15px;
  }
  
  .nav-title {
    font-size: 20px;
  }
  
  .main-container {
    padding: 20px 15px;
  }
  
  .action-section {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
  }
  
  .section-header h2 {
    font-size: 24px;
  }
  
  .action-buttons {
    width: 100%;
    justify-content: space-between;
  }
  
  .action-btn {
    flex: 1;
    justify-content: center;
  }
  
  .script-card {
    padding: 20px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .speech-section {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .speech-item {
    padding: 15px;
  }
}
</style>
