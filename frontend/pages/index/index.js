const recordsService = require('../../services/records.js');
const brandsService = require('../../services/brands.js');
const userStore = require('../../stores/user.js');
const authService = require('../../services/auth.js');

// 临时内联 calendar 函数避免模块加载问题
function formatDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function buildCalendarData(currentDate, records) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days = [];

  // 添加前面的空白天数
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // 添加当月的天数
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = formatDate(new Date(year, month, i));
    const dayRecords = records.filter(r => {
      const recordDate = r.consumeDate || r.date;
      return recordDate === dateStr;
    });

    const totalPrice = dayRecords.reduce((sum, record) => {
      return sum + (record.price || 0);
    }, 0);

    const brandGroups = dayRecords.reduce((groups, record) => {
      const brandId = record.brandId;
      const brandName = record.brandName || record.brand;
      const brandLogo = record.brandLogo || '/default-brand-icon.png';

      if (!groups[brandId]) {
        groups[brandId] = {
          id: brandId,
          name: brandName,
          logo: brandLogo,
          count: 0
        };
      }
      groups[brandId].count++;
      return groups;
    }, {});

    days.push({
      day: i,
      date: dateStr,
      records: dayRecords,
      count: dayRecords.length,
      amount: totalPrice,
      hasConsumption: dayRecords.length > 0,
      brandGroups: Object.values(brandGroups)
    });
  }

  return days;
}

Page({
  data: {
    user: null,
    records: [],
    brands: [],
    loading: true,
    error: '',

    showProfileModal: false,

    // 日历相关
    currentDate: new Date(),
    calendarDays: [],
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth(),
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],

    // 模态框状态
    showAddModal: false,
    showEditModal: false,
    currentRecord: null,
    selectedBrandName: '请选择品牌',
    formData: {
      brandId: '',
      category: '',
      sweetness: '半糖',
      iceLevel: '少冰',
      price: '',
      rating: 5,
      comment: '',
      consumeDate: ''
    }
  },

  async onLoad() {
    await this.loadData();
  },

  // 显示个人中心悬浮窗
  showProfileModal() {
    this.setData({ showProfileModal: true });
  },

  closeProfileModal() {
    this.setData({ showProfileModal: false });
  },

  // 跳转到个人设置页
  navigateToProfileEdit() {
    this.closeProfileModal();
    wx.navigateTo({ url: '/pages/profile/index' });
  },

  // 退出登录
  handleLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          try {
            authService.logout();
            userStore.clearUser();
            this.closeProfileModal();
            wx.reLaunch({ url: '/pages/login/login' });
          } catch (e) {
            wx.showToast({ title: '退出失败', icon: 'none' });
          }
        }
      }
    });
  },

  async onShow() {
    await this.loadData();
  },

  async loadData() {
    this.setData({ loading: true, error: '' });
    try {
      const user = userStore.getUser();
      const [records, brands] = await Promise.all([
        recordsService.getRecords(),
        brandsService.getAllBrands()
      ]);

      // 处理记录数据，添加品牌信息
      const processedRecords = records.map(record => {
        const brand = brands.find(b => b.id === record.brandId);
        let logoPath = '';
        if (brand) {
           if (brand.logoUrl && brand.logoUrl.startsWith('http')) {
             logoPath = brand.logoUrl;
           } else {
             const brandName = brand.name;
             logoPath = `/logos/${brandName}.png`;
             if (['喜茶', '奶茶'].includes(brandName)) {
                logoPath = `/logos/${brandName}.jpg`;
             }
           }
        }

        return {
          ...record,
          brandName: brand ? brand.name : '未知品牌',
          brandLogo: logoPath
        };
      });

      // 构建日历数据
      const currentDate = new Date(this.data.currentYear, this.data.currentMonth, 1);
      const calendarDays = buildCalendarData(currentDate, processedRecords);

      this.setData({
        user,
        records: processedRecords,
        brands,
        calendarDays
      });
    } catch (e) {
      console.error('加载数据失败:', e);

      if (e.code === 403 || e.code === 401) {
        wx.showToast({
          title: '请先登录',
          icon: 'none'
        });
        setTimeout(() => {
          wx.redirectTo({ url: '/pages/login/login' });
        }, 1500);
        return;
      }

      this.setData({ error: e && e.message ? e.message : '加载失败' });
    } finally {
      this.setData({ loading: false });
    }
  },

  // 上一个月
  prevMonth() {
    let { currentYear, currentMonth } = this.data;
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    this.setData({ currentYear, currentMonth });
    this.updateCalendar();
  },

  // 下一个月
  nextMonth() {
    let { currentYear, currentMonth } = this.data;
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    this.setData({ currentYear, currentMonth });
    this.updateCalendar();
  },

  // 更新日历
  updateCalendar() {
    const { currentYear, currentMonth, records } = this.data;
    const currentDate = new Date(currentYear, currentMonth, 1);
    const calendarDays = buildCalendarData(currentDate, records);
    this.setData({ calendarDays, currentDate });
  },

  // 查看某天的详情
  viewDayDetail(e) {
    const { date } = e.currentTarget.dataset;
    if (!date) return;

    const dayRecords = this.data.records.filter(r => {
      const recordDate = r.consumeDate || r.date;
      return recordDate === date;
    });

    if (dayRecords.length > 0) {
      this.setData({
        showDayDetailModal: true,
        selectedDate: date,
        dayRecords: dayRecords
      });
    } else {
      // 点击空白日期也可以添加记录
      this.showAddRecord(date);
    }
  },

  closeDayDetailModal() {
    this.setData({ showDayDetailModal: false });
  },

  // 打开添加记录模态框
  showAddRecord(date) {
    const today = new Date();
    const dateStr = typeof date === 'string' ? date : `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    this.setData({
      showAddModal: true,
      selectedBrandName: '请选择品牌',
      selectedBrandLogo: '',
      formData: {
        brandId: '',
        category: '',
        sweetness: '半糖',
        iceLevel: '少冰',
        price: '',
        rating: 5,
        comment: '',
        consumeDate: dateStr
      }
    });
  },

  // ...existing code...
  closeAddModal() {
    this.setData({ showAddModal: false });
  },

  // 表单输入处理
  onFormInput(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`formData.${field}`]: value
    });
  },

  onBrandChange(e) {
    const brandIndex = parseInt(e.detail.value);
    const selectedBrand = this.data.brands[brandIndex];

    if (selectedBrand) {
      let logoPath = selectedBrand.logoUrl;
      if (!logoPath || (!logoPath.startsWith('http') && !logoPath.startsWith('/'))) {
         logoPath = `/logos/${selectedBrand.name}.png`;
         if (['喜茶', '奶茶'].includes(selectedBrand.name)) {
            logoPath = `/logos/${selectedBrand.name}.jpg`;
         }
      }

      this.setData({
        'formData.brandId': selectedBrand.id,
        'selectedBrandName': selectedBrand.name,
        'selectedBrandLogo': logoPath
      });
    } else {
      this.setData({
        'formData.brandId': '',
        'selectedBrandName': '请选择品牌',
        'selectedBrandLogo': ''
      });
    }
  },

  // 添加自定义品牌
  async addCustomBrand() {
    wx.showModal({
      title: '添加新品牌',
      editable: true,
      placeholderText: '请输入品牌名称',
      success: async (res) => {
        if (res.confirm && res.content) {
          const name = res.content.trim();
          if (!name) return;

          try {
            wx.showLoading({ title: '创建中...' });
            const newBrand = await brandsService.createBrand({ name });

            // 重新加载品牌列表
            const brands = await brandsService.getAllBrands();
            this.setData({ brands });

            // 选中新创建的品牌
            const createdBrand = brands.find(b => b.name === name);
            if (createdBrand) {
              this.setData({
                'formData.brandId': createdBrand.id,
                'selectedBrandName': createdBrand.name,
                'selectedBrandLogo': '/public/default-avatar.svg' // 自定义品牌默认图标
              });
            }

            wx.hideLoading();
            wx.showToast({ title: '添加成功', icon: 'success' });
          } catch (e) {
            wx.hideLoading();
            wx.showToast({ title: e.message || '添加失败', icon: 'none' });
          }
        }
      }
    });
  },

  onSweetnessChange(e) {
    const sweetness = ['无糖', '三分糖', '半糖', '七分糖', '全糖'][e.detail.value];
    this.setData({
      'formData.sweetness': sweetness
    });
  },

  onIceChange(e) {
    const ice = ['去冰', '少冰', '正常冰', '多冰'][e.detail.value];
    this.setData({
      'formData.iceLevel': ice
    });
  },

  onRatingChange(e) {
    this.setData({
      'formData.rating': parseInt(e.detail.value)
    });
  },

  onDateChange(e) {
    this.setData({
      'formData.consumeDate': e.detail.value
    });
  },

  // 提交添加记录
  async submitAdd() {
    const { formData, brands } = this.data;

    // 验证
    if (!formData.brandId) {
      wx.showToast({ title: '请选择品牌', icon: 'none' });
      return;
    }
    if (!formData.category || formData.category.trim() === '') {
      wx.showToast({ title: '请输入品类', icon: 'none' });
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      wx.showToast({ title: '请输入有效价格', icon: 'none' });
      return;
    }

    try {
      wx.showLoading({ title: '添加中...' });

      const recordData = {
        brandId: parseInt(formData.brandId),
        category: formData.category.trim(),
        sweetness: formData.sweetness,
        iceLevel: formData.iceLevel,
        price: parseFloat(formData.price),
        rating: parseInt(formData.rating),
        comment: formData.comment || '',
        consumeDate: formData.consumeDate
      };

      await recordsService.createRecord(recordData);

      wx.hideLoading();
      wx.showToast({ title: '添加成功', icon: 'success' });

      this.setData({ showAddModal: false });
      await this.loadData();
    } catch (e) {
      wx.hideLoading();
      wx.showToast({
        title: e.message || '添加失败',
        icon: 'none'
      });
    }
  },

  // 编辑记录
  editRecord(e) {
    const { id } = e.currentTarget.dataset;
    const record = this.data.records.find(r => r.id === id);
    if (!record) return;

    const selectedBrand = this.data.brands.find(b => b.id === record.brandId);

    this.setData({
      showEditModal: true,
      currentRecord: record,
      selectedBrandName: selectedBrand ? selectedBrand.name : '未知品牌',
      formData: {
        brandId: record.brandId,
        category: record.category,
        sweetness: record.sweetness,
        iceLevel: record.iceLevel,
        price: record.price,
        rating: record.rating,
        comment: record.comment || '',
        consumeDate: record.consumeDate
      }
    });
  },

  closeEditModal() {
    this.setData({
      showEditModal: false,
      currentRecord: null
    });
  },

  // 提交编辑
  async submitEdit() {
    const { formData, currentRecord } = this.data;

    if (!formData.category || formData.category.trim() === '') {
      wx.showToast({ title: '请输入品类', icon: 'none' });
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      wx.showToast({ title: '请输入有效价格', icon: 'none' });
      return;
    }

    try {
      wx.showLoading({ title: '保存中...' });

      const recordData = {
        brandId: parseInt(formData.brandId),
        category: formData.category.trim(),
        sweetness: formData.sweetness,
        iceLevel: formData.iceLevel,
        price: parseFloat(formData.price),
        rating: parseInt(formData.rating),
        comment: formData.comment || '',
        consumeDate: formData.consumeDate
      };

      await recordsService.updateRecord(currentRecord.id, recordData);

      wx.hideLoading();
      wx.showToast({ title: '保存成功', icon: 'success' });

      this.setData({ showEditModal: false, currentRecord: null });
      await this.loadData();
    } catch (e) {
      wx.hideLoading();
      wx.showToast({
        title: e.message || '保存失败',
        icon: 'none'
      });
    }
  },

  // 删除记录
  deleteRecord(e) {
    const { id } = e.currentTarget.dataset;
    const record = this.data.records.find(r => r.id === id);
    if (!record) return;

    wx.showModal({
      title: '确认删除',
      content: `确定要删除这条记录吗？`,
      success: async (res) => {
        if (res.confirm) {
          try {
            wx.showLoading({ title: '删除中...' });
            await recordsService.deleteRecord(id);
            wx.hideLoading();
            wx.showToast({ title: '删除成功', icon: 'success' });
            await this.loadData();
          } catch (e) {
            wx.hideLoading();
            wx.showToast({
              title: e.message || '删除失败',
              icon: 'none'
            });
          }
        }
      }
    });
  }
});
