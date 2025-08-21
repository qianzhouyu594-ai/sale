import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// 全局订阅，保证 pinia 状态活跃
pinia.use(({ store }) => {
  store.$subscribe((mutation, state) => {
    // 只要订阅就行，不需要写内容
  })
})

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(ElementPlus).mount('#app')
