// server.js - 完整的后端服务器
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
const port = 3001

// 中间件配置
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// 内存数据存储 - 修改数据结构以匹配前端期望
const users = {}
const wxAccounts = {}
const prompts = {}
const labels = {}
const qaData = {}
const customers = {}

// 初始化一些测试数据 - 使用前端期望的数据格式
function initializeTestData() {
  // 测试用户
  users['admin'] = { username: 'admin', password: 'admin123', email: 'admin@test.com' }
  users['test'] = { username: 'test', password: 'test123', email: 'test@test.com' }

  // 测试微信账号
  wxAccounts['admin'] = [
    { wxid: 'wx001', wxname: '测试微信1' },
    { wxid: 'wx002', wxname: '测试微信2' },
  ]
  wxAccounts['test'] = [{ wxid: 'wx003', wxname: '测试微信3' }]

  // 测试标签 - 使用前端期望的格式 { id, label_key, label_value }
  labels['admin'] = [
    { id: 1, label_key: '重要客户', label_value: 'string' },
    { id: 2, label_key: '潜在客户', label_value: 'string' },
    { id: 3, label_key: '老客户', label_value: 'string' },
    { id: 4, label_key: 'VIP等级', label_value: 'number' },
    { id: 5, label_key: '是否活跃', label_value: 'boolean' },
  ]

  // 测试客户配置（新）：id, name, type, vip_level, active
  // type: '老客户' | '潜在客户' | '新客户'
  // vip_level: 0-5，active: true/false
  customers['admin'] = [
    { id: 1, name: '张三', type: '老客户', vip_level: 3, active: true },
    { id: 2, name: '李四', type: '潜在客户', vip_level: 1, active: false },
    { id: 3, name: '王五', type: '新客户', vip_level: 0, active: true },
    { id: 4, name: '赵六', type: '老客户', vip_level: 5, active: true },
  ]

  // 测试话术数据 - 使用前端期望的格式
  prompts['admin_wx001_realtime'] = {
    prompt_info:
      '您好，我是XX公司的销售代表，很高兴为您介绍我们的产品。我们的产品具有以下特点：1. 高质量保证 2. 价格优惠 3. 专业服务 4. 快速响应',
    letter_desc_array: [
      { key: '产品名称', name: '产品名称', select_enable: 1 },
      { key: '价格', name: '价格信息', select_enable: 1 },
      { key: '联系方式', name: '联系方式', select_enable: 0 },
      { key: '服务承诺', name: '服务保障说明', select_enable: 1 },
    ],
  }

  prompts['admin_wx001_history'] = {
    prompt_info:
      '根据您之前的需求，我们为您准备了以下解决方案：1. 定制化服务 2. 长期合作优惠 3. 技术支持保障',
    letter_desc_array: [
      { key: '客户需求', name: '具体需求描述', select_enable: 1 },
      { key: '解决方案', name: '解决方案详情', select_enable: 1 },
      { key: '合作期限', name: '合作时间安排', select_enable: 0 },
    ],
  }

  // 新增：为其他微信账号添加不同的话术，避免歧义
  prompts['admin_wx002_realtime'] = {
    prompt_info:
      '尊敬的客户，感谢您对我们产品的关注。我们提供专业的解决方案，包括：1. 技术咨询 2. 产品演示 3. 定制开发 4. 售后支持',
    letter_desc_array: [
      { key: '技术咨询', name: '技术问题解答', select_enable: 1 },
      { key: '产品演示', name: '产品功能展示', select_enable: 1 },
      { key: '定制开发', name: '个性化定制', select_enable: 1 },
      { key: '售后支持', name: '售后服务', select_enable: 0 },
    ],
  }

  prompts['admin_wx002_history'] = {
    prompt_info:
      '基于我们之前的合作经验，我们建议：1. 定期技术交流 2. 产品升级服务 3. 培训支持 4. 长期维护协议',
    letter_desc_array: [
      { key: '技术交流', name: '定期技术沟通', select_enable: 1 },
      { key: '产品升级', name: '版本更新服务', select_enable: 1 },
      { key: '培训支持', name: '使用培训', select_enable: 0 },
      { key: '维护协议', name: '长期维护', select_enable: 1 },
    ],
  }

  prompts['test_wx003_realtime'] = {
    prompt_info:
      '您好，我是测试公司的业务代表。我们专注于：1. 数据分析 2. 系统集成 3. 云服务 4. 安全防护',
    letter_desc_array: [
      { key: '数据分析', name: '数据挖掘服务', select_enable: 1 },
      { key: '系统集成', name: '系统整合', select_enable: 1 },
      { key: '云服务', name: '云计算服务', select_enable: 1 },
      { key: '安全防护', name: '网络安全', select_enable: 0 },
    ],
  }

  // 测试QA数据（新结构）：id, question, script1（标准话术）, script2（口语话术）, keyword
  qaData['admin'] = [
    {
      id: 1,
      question: '产品有什么优势？',
      script1: '我们的产品优势包括：质量可靠、价格实惠、服务周到。',
      script2: '我们这款真的挺靠谱的，性价比高，售后也跟得上。',
      keyword: '产品优势,性价比',
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      question: '如何申请售后服务？',
      script1: '售后服务流程：联系官方客服—提供订单信息—描述问题—等待处理结果。',
      script2: '需要售后就先找我们客服，把订单信息和问题说下，很快就给您安排。',
      keyword: '售后,客服,订单',
      created_at: new Date().toISOString(),
    },
  ]
}

// 初始化测试数据
initializeTestData()

// 用户认证相关接口
app.post('/api/wxlogin', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.json({ state: 'fail', msg: '用户名和密码不能为空' })
  }

  if (!users[username] || users[username].password !== password) {
    return res.json({ state: 'fail', msg: '用户名或密码错误' })
  }

  const userWxList = wxAccounts[username] || []

  res.json({
    state: 'success',
    msg: '登录成功',
    user: users[username],
    wx: userWxList,
  })
})

app.post('/api/register', (req, res) => {
  const { username, password, email } = req.body

  if (!username || !password) {
    return res.json({ state: 'fail', msg: '用户名和密码不能为空' })
  }

  if (users[username]) {
    return res.json({ state: 'fail', msg: '用户名已存在' })
  }

  users[username] = { username, password, email: email || '' }
  wxAccounts[username] = []
  labels[username] = []
  prompts[username] = {}
  qaData[username] = []
  customers[username] = []

  res.json({ state: 'success', msg: '注册成功' })
})

// 微信账号管理接口
app.post('/api/getwx', (req, res) => {
  const { username } = req.body

  if (!username || !users[username]) {
    return res.json({ state: 'fail', msg: '用户不存在' })
  }

  const userWxList = wxAccounts[username] || []
  res.json({ state: 'success', data: userWxList })
})

app.post('/api/add_wx', (req, res) => {
  const { username, wxid, wxname } = req.body

  if (!username || !wxid) {
    return res.json({ state: 'fail', msg: '参数不完整' })
  }

  if (!wxAccounts[username]) {
    wxAccounts[username] = []
  }

  // 检查是否已存在
  const exists = wxAccounts[username].find((wx) => wx.wxid === wxid)
  if (exists) {
    return res.json({ state: 'fail', msg: '微信账号已存在' })
  }

  wxAccounts[username].push({ wxid, wxname: wxname || wxid })

  res.json({ state: 'success', msg: '添加成功' })
})

// 微信注册接口
app.post('/auth/wxregister', (req, res) => {
  const { username, password, wxid, wxname } = req.body

  if (!username || !password || !wxid) {
    return res.json({ state: 'fail', msg: '参数不完整' })
  }

  // 创建或更新用户
  if (!users[username]) {
    users[username] = { username, password, email: '' }
    wxAccounts[username] = []
    labels[username] = []
    prompts[username] = {}
    qaData[username] = []
    customers[username] = []
  }

  // 添加微信账号
  if (!wxAccounts[username]) {
    wxAccounts[username] = []
  }

  const exists = wxAccounts[username].find((wx) => wx.wxid === wxid)
  if (!exists) {
    wxAccounts[username].push({ wxid, wxname: wxname || wxid })
  }

  res.json({ state: 'success', msg: '注册成功' })
})

// 话术管理接口 - 修改返回格式以匹配前端期望
app.post('/getprompt', (req, res) => {
  const { username, strategy, wxid } = req.body

  if (!username || !wxid) {
    return res.json({ state: 'fail', msg: '参数不完整' })
  }

  const key = `${username}_${wxid}_${strategy}`
  const promptData = prompts[key]

  if (promptData) {
    res.json({
      state: 'success',
      prompt_info: promptData.prompt_info,
      letter_desc_array: promptData.letter_desc_array,
    })
  } else {
    res.json({
      state: 'success',
      prompt_info: '',
      letter_desc_array: [],
    })
  }
})

app.post('/submitprompt', (req, res) => {
  const { username, strategy, wxid, prompt_info, letter_desc_array } = req.body

  if (!username || !wxid || !prompt_info) {
    return res.json({ state: 'fail', msg: '参数不完整' })
  }

  const key = `${username}_${wxid}_${strategy}`
  prompts[key] = {
    prompt_info,
    letter_desc_array: letter_desc_array || [],
  }

  res.json({ state: 'success', msg: '保存成功' })
})

// 话术分析接口 - 修改返回格式以匹配前端期望
app.post('/analyze', (req, res) => {
  const { username, wxid, prompt_info } = req.body

  if (!username || !wxid || !prompt_info) {
    return res.json({ state: 'fail', msg: '参数不完整' })
  }

  // 模拟AI分析结果 - 返回前端期望的格式
  const analysisResult = {
    prompt_new: `优化后的话术：${prompt_info}\n\n我们的产品具有以下特点：\n1. 高质量保证\n2. 价格优惠\n3. 专业服务\n4. 快速响应\n5. 24小时技术支持`,
    dict: {
      产品名称: '具体产品名称',
      价格: '具体价格信息',
      联系方式: '联系电话和地址',
      服务承诺: '服务保障说明',
      技术支持: '技术支持详情',
    },
  }

  res.json({
    state: 'success',
    ...analysisResult,
  })
})

// 标签管理接口 - 修改返回格式以匹配前端期望
app.post('/api/getlabels', (req, res) => {
  const { username } = req.body

  if (!username || !users[username]) {
    return res.json({ state: 'fail', msg: '用户不存在' })
  }

  const userLabels = labels[username] || []
  // 返回前端期望的格式：{ id, label_key, label_value }
  res.json({ state: 'success', data: userLabels })
})

app.post('/api/submitlabels', (req, res) => {
  const { username, labels: newLabels } = req.body

  if (!username || !users[username]) {
    return res.json({ state: 'fail', msg: '用户不存在' })
  }

  if (Array.isArray(newLabels)) {
    // 处理标签数据，确保格式正确
    const processedLabels = newLabels.map((label, index) => ({
      id: label.id || index + 1,
      label_key: label.label_key || label.name || '',
      label_value: label.label_value || label.type || 'string',
    }))

    labels[username] = processedLabels
    res.json({ state: 'success', msg: '保存成功' })
  } else {
    res.json({ state: 'fail', msg: '标签数据格式错误' })
  }
})

// 客户配置接口
app.post('/api/getCustomers', (req, res) => {
  const { username } = req.body || {}
  if (!username || !users[username]) {
    return res.json({ state: 'fail', msg: '用户不存在' })
  }
  const rows = customers[username] || []
  return res.json({ state: 'success', data: rows })
})

app.post('/api/submitCustomers', (req, res) => {
  const { username, customers: rows } = req.body || {}
  if (!username || !users[username]) {
    return res.json({ state: 'fail', msg: '用户不存在' })
  }
  if (!Array.isArray(rows)) {
    return res.json({ state: 'fail', msg: '数据格式错误' })
  }
  // 简单校验并归一化
  const normalized = rows.map((r, i) => ({
    id: Number(r.id) || i + 1,
    name: String(r.name || '').trim(),
    type: ['老客户', '潜在客户', '新客户'].includes(r.type) ? r.type : '新客户',
    vip_level: Math.max(0, Math.min(5, Number(r.vip_level) || 0)),
    active: Boolean(r.active),
  }))
  customers[username] = normalized
  return res.json({ state: 'success', msg: '保存成功' })
})

// 脚本配置相关接口
app.get('/auth/get_icebreaker', (_req, res) => {
  // 返回结构化的破冰话术，包含 keyword/script1/script2
  const icebreakers = [
    {
      id: 'S01',
      question: '先打个招呼吧~~',
      script1: '您好，很高兴认识您！我是这边负责对接的同事，方便交流下您的需求吗？',
      script2: '嗨～很高兴认识你，我是这边的对接，想了解下你的想法～',
      keyword: '打招呼,自我介绍',
    },
  ]

  res.json({
    state: 'success',
    data: icebreakers,
  })
})

app.post('/auth/queryall_qa_data_main', (req, res) => {
  const { username, page = 1, size = 10 } = req.body

  if (!username || !users[username]) {
    return res.json({ state: 'fail', msg: '用户不存在' })
  }

  const userQaData = qaData[username] || []
  const start = (page - 1) * size
  const end = start + size
  const paginatedData = userQaData.slice(start, end)

  res.json({
    state: 'success',
    data: paginatedData, // 直接返回{id,question,script1,script2,keyword}
    total: userQaData.length,
    page,
    size,
  })
})

app.post('/auth/del_qa_data_main', (req, res) => {
  const { username, id } = req.body

  if (!username || !users[username]) {
    return res.json({ state: 'fail', msg: '用户不存在' })
  }

  if (!qaData[username]) {
    qaData[username] = []
  }

  const index = qaData[username].findIndex((item) => item.id === id)
  if (index !== -1) {
    qaData[username].splice(index, 1)
    res.json({ state: 'success', msg: '删除成功' })
  } else {
    res.json({ state: 'fail', msg: '数据不存在' })
  }
})

// 通用数据操作接口 - 新结构：要求包含 question/script1/script2/keyword
app.post('/auth/add_qa_data', (req, res) => {
  const { username, question, script1, script2, keyword } = req.body

  if (!username || !users[username]) {
    return res.json({ state: 'fail', msg: '用户不存在' })
  }

  if (!qaData[username]) qaData[username] = []
  const newId = Date.now()
  qaData[username].push({
    id: newId,
    question: question || '',
    script1: script1 || '',
    script2: script2 || '',
    keyword: keyword || '',
    created_at: new Date().toISOString(),
  })

  res.json({ state: 'success', msg: '添加成功', id: newId })
})

app.post('/auth/update_qa_data', (req, res) => {
  const { username, id, question, script1, script2, keyword } = req.body

  if (!username || !users[username]) {
    return res.json({ state: 'fail', msg: '用户不存在' })
  }

  if (!qaData[username]) {
    qaData[username] = []
  }

  const index = qaData[username].findIndex((item) => item.id === id)
  if (index !== -1) {
    qaData[username][index] = {
      ...qaData[username][index],
      question: question ?? qaData[username][index].question,
      script1: script1 ?? qaData[username][index].script1,
      script2: script2 ?? qaData[username][index].script2,
      keyword: keyword ?? qaData[username][index].keyword,
    }
    res.json({ state: 'success', msg: '更新成功' })
  } else {
    res.json({ state: 'fail', msg: '数据不存在' })
  }
})

// 健康检查接口
app.get('/health', (_req, res) => {
  res.json({
    state: 'success',
    message: '服务器运行正常',
    timestamp: new Date().toISOString(),
    users: Object.keys(users).length,
  })
})

// 获取服务器状态
app.get('/status', (_req, res) => {
  res.json({
    state: 'success',
    data: {
      totalUsers: Object.keys(users).length,
      totalWxAccounts: Object.values(wxAccounts).reduce((sum, arr) => sum + arr.length, 0),
      totalPrompts: Object.keys(prompts).length,
      totalLabels: Object.values(labels).reduce((sum, arr) => sum + arr.length, 0),
      totalQaData: Object.values(qaData).reduce((sum, arr) => sum + arr.length, 0),
      totalCustomers: Object.values(customers).reduce((sum, arr) => sum + arr.length, 0),
    },
  })
})

// 错误处理中间件
app.use((err, _req, res, _next) => {
  console.error('服务器错误:', err)
  res.status(500).json({
    state: 'fail',
    msg: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : '未知错误',
  })
})

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    state: 'fail',
    msg: '接口不存在',
    path: req.originalUrl,
  })
})

// 启动服务器
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 ComSkill 后端服务器已启动`)
  console.log(`📍 本地访问: http://localhost:${port}`)
  console.log(`🌐 网络访问: http://0.0.0.0:${port}`)
  console.log(`📊 健康检查: http://localhost:${port}/health`)
  console.log(`📈 服务器状态: http://localhost:${port}/status`)
  console.log(`🔧 已初始化测试数据，可使用以下账号登录:`)
  console.log(`   用户名: admin, 密码: admin123`)
  console.log(`   用户名: test, 密码: test123`)
})
