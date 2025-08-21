<template>
  <div class="label-container">
    <div class="top-nav">
      <button class="nav-back-btn" @click="goBack">
        <span class="nav-back-icon">←</span>
        返回工作台
      </button>
      <div class="nav-title">客户配置</div>
      <div class="nav-subtitle">统一管理客户类型、VIP等级与活跃状态</div>
    </div>

    <div class="main-card simple">
      <div class="header-row">
        <div class="header-left">
          <h2>客户列表</h2>
          <p>客户姓名｜客户类型｜客户配置（VIP等级/是否活跃）</p>
        </div>
        <div class="header-actions">
          <el-input v-model="searchKeyword" placeholder="按姓名搜索..." class="search-input" clearable />
          <button class="action-btn primary" @click="addCustomer">
            <span class="btn-icon">➕</span>
            新增客户
          </button>
          <button class="action-btn secondary" :disabled="saving" @click="saveAll">
            <span class="btn-icon">💾</span>
            {{ saving ? '保存中...' : '保存全部' }}
          </button>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="cfg-table">
          <colgroup>
            <col style="width:25%" />
            <col style="width:25%" />
            <col style="width:25%" />
            <col style="width:25%" />
          </colgroup>
          <thead>
            <tr>
              <th rowspan="2">客户姓名</th>
              <th rowspan="2">客户类型</th>
              <th colspan="2">客户配置</th>
            </tr>
            <tr>
              <th>VIP等级</th>
              <th>是否活跃</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in filteredCustomers" :key="row._localId || row.id || idx">
              <td>
                <el-input v-model="row.name" placeholder="如：张三" @input="markDirty(row)" />
              </td>
              <td>
                <el-select v-model="row.type" placeholder="选择类型" @change="markDirty(row)">
                  <el-option label="老客户" value="老客户" />
                  <el-option label="潜在客户" value="潜在客户" />
                  <el-option label="新客户" value="新客户" />
                </el-select>
              </td>
              <td>
                <el-select v-model="row.vip_level" placeholder="0-5" @change="markDirty(row)">
                  <el-option v-for="n in 6" :key="n-1" :label="n-1" :value="n-1" />
                </el-select>
              </td>
              <td>
                <el-select v-model="row.active" placeholder="选择" @change="markDirty(row)">
                  <el-option label="活跃" :value="true" />
                  <el-option label="不活跃" :value="false" />
                </el-select>
              </td>
            </tr>
            <tr v-if="filteredCustomers.length === 0">
              <td colspan="4" class="empty-td">暂无客户数据，点击右上角「新增客户」开始配置</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'

interface CustomerItem {
  id?: number
  _localId?: string
  name: string
  type: '老客户' | '潜在客户' | '新客户' | ''
  vip_level: number | ''
  active: boolean | ''
  _dirty?: boolean
}

const router = useRouter()
const userStore = useUserStore()
const username = computed(() => userStore?.user?.username || 'admin')

const customers = ref<CustomerItem[]>([])
const searchKeyword = ref('')
const saving = ref(false)

const filteredCustomers = computed(() => {
  const kw = searchKeyword.value.trim().toLowerCase()
  if (!kw) return customers.value
  return customers.value.filter((c) => (c.name || '').toLowerCase().includes(kw))
})

function goBack() { router.push('/dashboard') }

function normalizeFromBackend(rows: any[]): CustomerItem[] {
  if (!Array.isArray(rows)) return []
  return rows.map((r) => ({
    id: typeof r.id === 'number' ? r.id : Number(r.id) || undefined,
    name: String(r.name ?? '').trim(),
    type: (['老客户', '潜在客户', '新客户'].includes(r.type) ? r.type : '') as any,
    vip_level: Number(r.vip_level),
    active: Boolean(r.active),
  }))
}

async function loadCustomers() {
  try {
    const res = await fetch('/api/getCustomers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value }),
    })
    const data = await res.json()
    customers.value = normalizeFromBackend(data?.data || [])
  } catch { ElMessage.error('加载客户数据失败') }
}

function addCustomer() {
  customers.value.push({
    _localId: `local_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: '', type: '', vip_level: 0, active: true, _dirty: true,
  })
}

function markDirty(row: CustomerItem) { row._dirty = true }

function validateAll(): boolean {
  for (const r of customers.value) {
    if (!r.name || !r.type || r.vip_level === '' || r.active === '') {
      ElMessage.warning('请完善每一行的「姓名/类型/VIP/活跃」后再保存')
      return false
    }
  }
  const names = customers.value.map((r) => r.name.trim())
  const set = new Set<string>()
  for (const n of names) {
    if (set.has(n)) { ElMessage.warning(`存在重复姓名：${n}`); return false }
    set.add(n)
  }
  return true
}

async function saveAll() {
  if (saving.value) return
  if (!validateAll()) return
  try {
    saving.value = true
    const payload = customers.value.map((r, i) => ({
      id: r.id ?? i + 1,
      name: r.name.trim(),
      type: r.type,
      vip_level: Number(r.vip_level) || 0,
      active: Boolean(r.active),
    }))
    const res = await fetch('/api/submitCustomers', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, customers: payload }),
    })
    const data = await res.json()
    if (data?.state === 'success') { ElMessage.success('保存成功'); await loadCustomers() }
    else { ElMessage.error(data?.msg || '保存失败') }
  } catch { ElMessage.error('保存失败') } finally { saving.value = false }
}

onMounted(loadCustomers)
</script>

<style scoped>
:root { --color-pink:#E89DA0; --color-blue:#88CEE6; --color-orange:#F6C8A8; --color-green:#B2D3A8; }
.label-container { width:100vw; min-height:100vh; display:flex; flex-direction:column; align-items:center; background:linear-gradient(135deg,#f5f7fa 0%,#c3cfe2 100%); padding-top:80px; }
.top-nav { position:fixed; top:0; left:0; width:100%; background:linear-gradient(135deg,var(--color-blue) 0%,var(--color-green) 100%); box-shadow:0 4px 20px rgba(0,0,0,.1); z-index:100; display:flex; align-items:center; padding:16px 20px; box-sizing:border-box; }
.nav-back-btn { background:#e0e0e0; color:#222; border:none; padding:8px 14px; border-radius:8px; font-size:14px; cursor:pointer; transition:all .3s; display:flex; align-items:center; gap:6px; }
.nav-back-btn:hover { background:#d0d0d0; }
.nav-back-icon { font-size:16px; font-weight:700; }
.nav-title { font-size:20px; font-weight:700; color:#111; flex-grow:1; text-align:center; }
.nav-subtitle { font-size:16px; color:#333; }

.main-card.simple { width:100%; max-width:1100px; margin-top:20px; background:#fff; border-radius:12px; box-shadow:0 10px 24px rgba(0,0,0,.08); overflow:hidden; }
.header-row { display:flex; justify-content:space-between; align-items:center; gap:16px; padding:16px 20px; border-bottom:1px solid #eef2f7; }
.header-left h2 { margin:0 0 6px 0; font-size:25px; color:#2c3e50; }
.header-left p { margin:0; color:#7f8c8d; font-size:16px; }
.header-actions { display:flex; align-items:center; gap:10px; }
.search-input { width:220px; }
.action-btn { padding:10px 18px; border-radius:10px; font-size:16px; font-weight:600; cursor:pointer; border:none; display:flex; align-items:center; gap:6px; transition:all .3s; box-shadow:0 4px 15px rgba(0,0,0,.08); }
.action-btn.primary { background:linear-gradient(135deg,var(--color-green),var(--color-blue) 100%); color:black; }
.action-btn.secondary { background:linear-gradient(135deg,var(--color-orange),var(--color-pink) 100%); color:black; }
.action-btn:hover { transform:translateY(-2px); }

.table-wrapper { padding:0 20px 20px 20px; }
.cfg-table { width:100%; table-layout:fixed; border-collapse:separate; border-spacing:0; border:1px solid #eef2f7; border-radius:10px; overflow:hidden; }
.cfg-table thead th { background:#f8fafc; color:#667085; font-weight:700; padding:12px 6px; text-align:center; border-bottom:1px solid #eef2f7; }
.cfg-table tbody td { padding:10px 8px; text-align:center; border-bottom:1px dashed #eef2f7; }

/* 统一控件高度与圆角，且居中文本 */
:deep(.el-input__wrapper), :deep(.el-select__wrapper) { height:40px; border-radius:10px; }
:deep(.el-input__inner) { height:40px; text-align:center; }
:deep(.el-select__selection) { justify-content:center; }

.empty-td { padding:28px 10px; color:#7f8c8d; }

@media (max-width: 900px) { .search-input{width:160px;} .header-row{flex-direction:column; align-items:flex-start;} }
</style>
