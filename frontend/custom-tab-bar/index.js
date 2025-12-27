Component({
  data: {
    selected: 0,
    color: "#999999",
    selectedColor: "#8B4513",
    list: [{
      pagePath: "/pages/index/index",
      text: "首页"
    }, {
      pagePath: "/pages/records/index",
      text: "记录"
    }, {
      pagePath: "/pages/statistics/index",
      text: "统计"
    }]
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})