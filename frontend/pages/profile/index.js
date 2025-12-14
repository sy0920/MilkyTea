const userService = require('../../services/user.js');
const authService = require('../../services/auth.js');
const userStore = require('../../stores/user.js');
const statisticsService = require('../../services/statistics.js');

Page({
  data: {
    user: null,
    summary: null,
    loading: true,
    error: '',

    // 模态框状态
    showEditModal: false,
    activeTab: 'profile', // 'profile' or 'password'

    // 表单数据
    editForm: {
      username: '',
      phone: '',
      avatar: ''
    },
    passwordForm: {
      oldPassword: '',
      newPassword: ''
    },

    // 预设头像列表
    avatars: [
      '/public/default-avatar.svg',
      '/logos/喜茶.jpg',
      '/logos/茶颜悦色.png',
      '/logos/蜜雪冰城.png',
      '/logos/茶百道.png',
      '/logos/古茗.png'
    ]
  },

  async onLoad() {
    await this.loadData();
  },

  async onShow() {
    await this.loadData();
  },

  async loadData() {
    this.setData({ loading: true, error: '' });
    try {
      const user = userStore.getUser();

      if (!user) {
        this.setData({ error: '未登录' });
        return;
      }

      const [userInfo, summary] = await Promise.all([
        userService.getUserInfo(),
        statisticsService.getSummary().catch(() => null)
      ]);

      this.setData({
        user: userInfo || user,
        summary
      });
    } catch (e) {
      console.error('加载用户信息失败:', e);
      this.setData({ error: e && e.message ? e.message : '加载失败' });
    } finally {
      this.setData({ loading: false });
    }
  },

  // 打开编辑模态框
  showEdit() {
    const { user } = this.data;
    if (!user) return;

    this.setData({
      showEditModal: true,
      activeTab: 'profile',
      editForm: {
        username: user.username || '',
        phone: user.phone || '',
        avatar: user.avatar || '/public/default-avatar.svg'
      },
      passwordForm: {
        oldPassword: '',
        newPassword: ''
      }
    });
  },

  closeEditModal() {
    this.setData({ showEditModal: false });
  },

  switchTab(e) {
    const { tab } = e.currentTarget.dataset;
    this.setData({ activeTab: tab });
  },

  // 表单输入处理
  onEditInput(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`editForm.${field}`]: value
    });
  },

  onPasswordInput(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`passwordForm.${field}`]: value
    });
  },

  selectAvatar(e) {
    const { src } = e.currentTarget.dataset;
    this.setData({
      'editForm.avatar': src
    });
  },

  // 提交个人信息修改
  async submitProfile() {
    const { editForm } = this.data;

    if (!editForm.username || editForm.username.trim() === '') {
      wx.showToast({ title: '用户名不能为空', icon: 'none' });
      return;
    }

    try {
      wx.showLoading({ title: '保存中...' });

      await userService.updateUserInfo({
        username: editForm.username.trim(),
        phone: editForm.phone.trim(),
        avatar: editForm.avatar
      });

      wx.hideLoading();
      wx.showToast({ title: '保存成功', icon: 'success' });

      this.setData({ showEditModal: false });
      await this.loadData();
    } catch (e) {
      wx.hideLoading();
      wx.showToast({
        title: e.message || '保存失败',
        icon: 'none'
      });
    }
  },

  // 提交密码修改
  async submitPassword() {
    const { passwordForm } = this.data;

    if (!passwordForm.oldPassword || !passwordForm.newPassword) {
      wx.showToast({ title: '请填写完整', icon: 'none' });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      wx.showToast({ title: '新密码至少6位', icon: 'none' });
      return;
    }

    try {
      wx.showLoading({ title: '修改中...' });

      await userService.updatePassword(passwordForm.oldPassword, passwordForm.newPassword);

      wx.hideLoading();
      wx.showToast({ title: '修改成功', icon: 'success' });

      this.setData({ showEditModal: false });
    } catch (e) {
      wx.hideLoading();
      wx.showToast({
        title: e.message || '修改失败',
        icon: 'none'
      });
    }
  },

  // 登出
  handleLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          try {
            authService.logout();
            userStore.clearUser();
            wx.showToast({ title: '已退出', icon: 'success' });

            setTimeout(() => {
              wx.reLaunch({ url: '/pages/login/login' });
            }, 1500);
          } catch (e) {
            wx.showToast({
              title: e.message || '退出失败',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  // 关于应用
  showAbout() {
    wx.showModal({
      title: '关于 MilkyTea',
      content: '奶茶消费记录小程序\n版本：1.0.0\n帮助你记录和管理奶茶消费',
      showCancel: false
    });
  }
});
