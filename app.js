//app.js
const loginTool = require('./utils/loginTool.js');

const wechat = require('./utils/wechat.js');

const utils = require('./utils/util.js');



App({
  currentbg: {
    bgcolor: '#f14949',
    linecolor: '#f14949',
    textcolor: '#fff'
  },
    _host: 'https://cy.tiantianremai.cn',
  _mhost:'https://op.tiantianremai.cn/wmplus/onefive',
  access_token: null,
  extURI: false,
  shopId: null,
  navTitle: null,
  tablesid: null,
  loginCode: null,
  isLog: false,
  isLinkCarteDetail: 1,
  weid: null,
  isMyCenter: 0, //是否我的中心
  modeInfo: {}, //显示模板
  isMerge: false, //预点订单过来的
  isLinkDetail: false,
  version: '',
  localCount:1,//限制大王卡显示次数
  onLaunch: function () {
    // this.getUserInfo();
    let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {};
    console.log('----店铺extConfig ------')
    console.log(extConfig)
    console.log('----店铺extConfig end---')
    if (utils.isEmpty(extConfig)) {
      this.shopId = 3;
      this.weid = 2428;
      this.extURI = false;
      this.version = "1.6.0";
      // this.showErrorModal('请升级最新版本微信')
    } else {
      this.shopId = extConfig.shopId;
      this.weid = extConfig.weid || 0;
      this.navTitle = extConfig.navTitle || '';
      this.extURI = extConfig.extURI || false;
      this.version = extConfig.version || "1.6.0";
    }
  },
  checkSession: function (cb) { //验证session是否过期
    var that = this;
    wx.checkSession({
      success: function (res) {
        var access_token = wx.getStorageSync('access_token') || {};
        if (utils.isEmpty(access_token)) {
          that.isLogin(cb);
        } else {
          that.access_token = access_token;
          wx.setStorageSync('access_token', access_token);
          return cb && cb({ access_token })
        }
      },
      fail: function (err) {
        that.isLogin(cb);
      }
    })
  },
  isLogin: function (cb) { //是否登录
    loginTool.getLogin().then((res) => {
      if (res.code) {
        this.loginCode = res.code;
        console.log('是否登录')
        return this.ajaxUser(res.code, cb)
      } else {
        this.isLogin();
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    }, (err) => {
      this.isLogin();
    })
  },
  getUserInfo: function () { //获取用户信息
    var that = this;
    wx.login({
      success: function () {
        loginTool.getUserInfo().then((res) => {
          console.log('获取用户信息')
          that.getLocation('wgs84', true);
        }, (err) => {
          console.log('----获取用户失败 ------')
          console.log(err)
          console.log('----获取用户失败 end---')
          that.getLocation('wgs84', false);
        })
      }

    })
  },
  ajaxUser: function (code, cb) { //获取登录信息
    var that = this,
      code = code;
    loginTool.getUserInfo()
      .then((res) => {
        var params = {
          "code": code,
          "id": this.shopId,
          "weid": this.weid,
          "encryptedData": res.encryptedData,
          "iv": res.iv
        };
        loginTool.getLoginInfo(params).then((data) => {
          console.log(data)
          // console.log(!data.data.hasOwnProperty('code'));
          if (!data.data.hasOwnProperty('code')) {
            wx.setStorageSync('access_token', data.data.data.access_token);
            wx.setStorageSync('uid', data.data.data.wxUserInfo.uid);
            that.access_token = data.data.data.access_token;
            // that.setData({uid:data.data.data.wxUserInfo.uid});
            var params = {
              'access_token': data.data.data.access_token,
              'uid': data.data.data.wxUserInfo.uid
            };
            // console.log(params)
            cb && cb(params)
          } else {
            // that.ajaxUser(code, cb);
          }
        }, (err) => {
          // this.ajaxUser(code, cb);
          console.log(err);
        })
      }, (err) => {
        wx.redirectTo({
          url: '/pages/setting/setting'
        })
        console.log('----获取用户失败 ------')
        console.log(err)
        console.log('----获取用户失败 end---')
      })
  },
  showToast: function (title, icon, duration, success) {
    var iconList = {
      fail: "/images/public/fail.png",
      success: "/images/public/success.png",
      question: "/images/public/question.png",
      time: "/images/public/time.png"
    }

    wx.showToast({
      title: title || '加载中',
      image: iconList[icon] || iconList['fail'],
      mask: true,
      duration: duration || 1500,
      success: function () {
        success && success();
      }
    });
  },

  getLocation: function (type, flag) {
    //flag true 用户授权成功 用户授权失败
    wechat.getLocation(type).then((res) => {
      wx.setStorageSync('dir', {
        lat: res.latitude,
        lng: res.longitude
      })
      if (!flag) {
        wx.redirectTo({
          url: '/pages/setting/setting'
        })
      }
    }, (err) => {
      wx.redirectTo({
        url: '/pages/setting/setting'
      })
    })
  },
  globalData: {
    access_token: null
  }
})