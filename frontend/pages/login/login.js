Page({
  data: {
    username: '',
    password: '',
    phone: '',
    loading: false,
    isLogin: true // true = 登录, false = 注册
  },

  onLoad() {
    // 检查是否已登录
    const token = wx.getStorageSync('token');
    if (token) {
      // 已登录，跳转到首页
      wx.switchTab({ url: '/pages/index/index' });
    }
  },

  onUsernameInput(e) {
    this.setData({ username: e.detail.value });
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },

  toggleMode() {
    this.setData({
      isLogin: !this.data.isLogin,
      // 清空表单
      username: '',
      password: '',
      phone: ''
    });
  },

  async handleSubmit() {
    const { username, password, phone, isLogin } = this.data;

    // 登录模式验证
    if (isLogin) {
      if (!phone || phone.trim() === '') {
        wx.showToast({ title: '请输入手机号', icon: 'none' });
        return;
      }
      const phoneReg = /^1[3-9]\d{9}$/;
      if (!phoneReg.test(phone.trim())) {
        wx.showToast({ title: '请输入11位有效的手机号', icon: 'none' });
        return;
      }
      if (!password || password.length < 6) {
        wx.showToast({ title: '密码至少6位', icon: 'none' });
        return;
      }
    }
    // 注册模式验证
    else {
      if (!username || username.trim() === '') {
        wx.showToast({ title: '请输入用户名', icon: 'none' });
        return;
      }
      const trimmedUsername = username.trim();
      if (trimmedUsername.length < 3 || trimmedUsername.length > 25) {
        wx.showToast({ title: '用户名需3-25个字符', icon: 'none' });
        return;
      }
      if (!phone || phone.trim() === '') {
        wx.showToast({ title: '请输入手机号', icon: 'none' });
        return;
      }
      const phoneReg = /^1[3-9]\d{9}$/;
      if (!phoneReg.test(phone.trim())) {
        wx.showToast({ title: '请输入11位有效的手机号', icon: 'none' });
        return;
      }
      if (!password || password.length < 6 || password.length > 25) {
        wx.showToast({ title: '密码需6-25个字符', icon: 'none' });
        return;
      }
      if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
        wx.showToast({ title: '密码需包含字母和数字', icon: 'none' });
        return;
      }
    }

    this.setData({ loading: true });

    try {
      const authService = require('../../services/auth.js');

      if (isLogin) {
        // 登录：使用手机号和密码
        await authService.login({
          phone: phone.trim(),
          password: password.trim()
        });

        wx.showToast({ title: '登录成功', icon: 'success' });
      } else {
        // 注册
        await authService.register({
          username: username.trim(),
          password: password.trim(),
          phone: phone.trim()
        });

        wx.showToast({ title: '注册成功', icon: 'success' });
      }

      // 延迟跳转，让用户看到提示
      setTimeout(() => {
        wx.switchTab({ url: '/pages/index/index' });
      }, 1500);

    } catch (e) {
      console.error('认证失败:', e);
      let errorMsg = e.message || (isLogin ? '登录失败' : '注册失败');

      // 根据错误码提供更友好的提示
      if (e.code === 400) {
        errorMsg = '输入信息格式不正确';
      } else if (e.code === 409) {
        errorMsg = '用户名或手机号已存在';
      } else if (e.code === 401) {
        errorMsg = '手机号或密码错误';
      }

      wx.showToast({
        title: errorMsg,
        icon: 'none',
        duration: 2000
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  // 快速测试登录（开发用）
  async quickLogin() {
    wx.showModal({
      title: '测试登录',
      content: '将使用测试账号快速登录',
      success: async (res) => {
        if (res.confirm) {
          this.setData({ loading: true });

          // 使用符合复杂度的密码
          const testUser = {
            username: 'testuser',
            password: 'TestUser123', // 包含字母和数字
            phone: '13800138000'
          };

          try {
            const authService = require('../../services/auth.js');

            // 先尝试登录
            try {
              await authService.login({
                phone: testUser.phone,
                password: testUser.password
              });
              wx.showToast({ title: '登录成功', icon: 'success' });
            } catch (loginErr) {
              // 登录失败，尝试注册
              console.log('登录失败，尝试注册:', loginErr);
              await authService.register({
                username: testUser.username,
                password: testUser.password,
                phone: testUser.phone
              });
              wx.showToast({ title: '注册成功', icon: 'success' });
            }

            setTimeout(() => {
              wx.switchTab({ url: '/pages/index/index' });
            }, 1500);

          } catch (e) {
            console.error('快速登录失败:', e);
            wx.showToast({
              title: '测试登录失败: ' + (e.message || '请检查后端服务'),
              icon: 'none',
              duration: 3000
            });
          } finally {
            this.setData({ loading: false });
          }
        }
      }
    });
  }
});
