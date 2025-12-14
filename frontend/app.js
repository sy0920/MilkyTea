App({
  globalData: {
    token: '',
    user: null
  },
  onLaunch() {
    try {
      const token = wx.getStorageSync('token');
      if (token) {
        this.globalData.token = token;
      }
      const user = wx.getStorageSync('user');
      if (user) {
        this.globalData.user = user;
      }
    } catch (e) {
      console.warn('Storage read failed', e);
    }
  }
});

