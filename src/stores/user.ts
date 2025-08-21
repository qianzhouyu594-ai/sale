import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    password: '',
    wxList: [] as Array<{ wxid: string; wxname: string }>,
    selectedWx: null as { wxid: string; wxname: string } | null,
    user: null as any,
  }),
  actions: {
    setUser(user: { username: string; password: string }) {
      this.user = user
      this.username = user.username || ''
      this.password = user.password || ''
      // 保存到localStorage
      localStorage.setItem('user', JSON.stringify(user))
    },
    setWxList(wxList: Array<{ wxid: string; wxname: string }>) {
      this.wxList = wxList
      localStorage.setItem('wxList', JSON.stringify(wxList))
    },
    setSelectedWx(wx: { wxid: string; wxname: string }) {
      this.selectedWx = wx
      localStorage.setItem('selectedWx', JSON.stringify(wx))
    },
    clearUser() {
      this.user = null
      this.username = ''
      this.password = ''
      this.wxList = []
      this.selectedWx = null
    },
  },
})
