const { getRecords, searchRecords } = require('../../services/records');

Page({
  data: {
    searchQuery: '',
    isSearching: false,
    searchResult: null,
    records: [],
    displayRecords: []
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1 // Assuming records is the second tab (index 1)
      })
    }
    const authStore = require('../../stores/auth.js');
    if (!authStore.isAuthenticated()) {
      wx.reLaunch({ url: '/pages/login/login' });
      return;
    }
    if (!this.data.isSearching) {
      this.loadRecords()
    }
  },

  processRecords(records) {
    if (!records) return [];
    return records.map(record => {
      const brandName = record.brandName || record.brand;
      let logoPath = `/logo_images/${brandName}.png`;
      // 特殊处理使用jpg格式的品牌
      if (brandName === '喜茶' || brandName === '奈雪的茶' || brandName === '另茶') {
        logoPath = `/logo_images/${brandName}.jpg`;
      }
      return {
        ...record,
        brandLogo: logoPath
      };
    });
  },

  loadRecords() {
    getRecords().then(res => {
      const processed = this.processRecords(res);
      this.setData({
        records: processed,
        displayRecords: processed
      })
    }).catch(err => {
      console.error(err)
    })
  },

  onSearchInput(e) {
    this.setData({
      searchQuery: e.detail.value
    })
    if (!e.detail.value.trim()) {
      this.setData({
        isSearching: false,
        searchResult: null,
        displayRecords: this.data.records
      })
    }
  },

  onSearch() {
    const query = this.data.searchQuery.trim()
    if (!query) return

    wx.showLoading({ title: '搜索中...' })
    searchRecords(query).then(res => {
      // Format average rating
      if (res.averageRating) {
        res.averageRating = res.averageRating.toFixed(1)
      }
      
      const processedRecords = this.processRecords(res.myRecords);

      this.setData({
        isSearching: true,
        searchResult: {
          ...res,
          myRecords: processedRecords
        },
        displayRecords: processedRecords
      })
    }).catch(err => {
      wx.showToast({
        title: '搜索失败',
        icon: 'none'
      })
    }).finally(() => {
      wx.hideLoading()
    })
  },

  onRecordTap(e) {
    // Handle record tap if needed
    const id = e.currentTarget.dataset.id
    // wx.navigateTo({ url: `/pages/record-detail/index?id=${id}` })
  }
})