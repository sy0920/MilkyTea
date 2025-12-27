const recordsService = require('../../services/records.js');

Page({
  data: {
    loading: true,
    error: '',

    // 概览统计
    summary: {
      totalCups: 0,
      totalAmount: 0,
      avgPrice: '0.0'
    },

    // 原始记录
    records: [],

    // 排行榜
    topRated: [], // 评分TOP5
    topFreq: [],  // 品牌购买次数TOP5
  },

  async onLoad() {
    const authStore = require('../../stores/auth.js');
    if (!authStore.isAuthenticated()) {
      wx.reLaunch({ url: '/pages/login/login' });
      return;
    }
    await this.loadData();
  },

  async onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
    const authStore = require('../../stores/auth.js');
    if (!authStore.isAuthenticated()) {
      wx.reLaunch({ url: '/pages/login/login' });
      return;
    }
    await this.loadData();
  },

  async loadData() {
    this.setData({ loading: true, error: '' });
    try {
      const records = await recordsService.getRecords();
      this.calculateStats(records);
      this.setData({ records });
    } catch (e) {
      console.error('加载统计数据失败:', e);
      this.setData({ error: e && e.message ? e.message : '加载失败' });
    } finally {
      this.setData({ loading: false });
    }
  },

  calculateStats(records) {
    const totalCups = records.length;
    const totalAmountNum = records.reduce(function(sum, r) { return sum + (Number(r.price) || 0); }, 0);
    const avgPrice = totalCups === 0 ? '0.0' : (totalAmountNum / totalCups).toFixed(2);

    const summary = {
      totalCups: totalCups,
      totalAmount: Number(totalAmountNum.toFixed(2)),
      avgPrice: avgPrice
    };

    // 评分TOP5（ES5安全）
    var ratedList = records.map(function(r) {
      return {
        id: r.id,
        brandName: r.brandName || r.brand || '未知品牌',
        drinkName: r.drinkName || r.category || '-',
        rating: r.rating != null ? Number(r.rating) : (r.score != null ? Number(r.score) : 0)
      };
    });
    ratedList.sort(function(a, b) { return (b.rating || 0) - (a.rating || 0); });
    var topRated = ratedList.slice(0, 5);

    // 购买次数TOP5（ES5安全）
    var drinkCount = {};
    for (var i = 0; i < records.length; i++) {
      var brand = records[i].brandName || records[i].brand || '未知品牌';
      var drink = records[i].drinkName || records[i].category || '未知品类';
      var key = brand + '|||' + drink;
      drinkCount[key] = (drinkCount[key] || 0) + 1;
    }
    var topFreqArr = [];
    for (var key in drinkCount) {
      if (Object.prototype.hasOwnProperty.call(drinkCount, key)) {
        var parts = key.split('|||');
        topFreqArr.push({ 
          name: parts[0] + ' ' + parts[1], // Fallback display
          brandName: parts[0],
          drinkName: parts[1],
          count: drinkCount[key] 
        });
      }
    }
    topFreqArr.sort(function(a, b) { return b.count - a.count; });
    var topFreq = topFreqArr.slice(0, 5);

    this.setData({
      summary: summary,
      topRated: topRated,
      topFreq: topFreq
    });
  }
});
