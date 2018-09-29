var app = getApp(),
  API = require('../../utils/api.js'),
  utils = require('../../utils/util.js');

Page({
  data: {
    //调用系统颜色
    pagecolor: {
      bgcolor: app.currentbg.bgcolor,
      textcolor: app.currentbg.textcolor
    },
    access_token: null,
    id: '2',
    picData: {},
    tel: '',
  },

  onLoad: function (options) {
    var access_token = app.access_token || wx.getStorageSync('access_token'),
      id = options.id || '',
      title = options.title || '图文详情';
    wx.setNavigationBarTitle({ title })
    this.setData({ access_token, id })
  },
  onShow: function () {
    this.getData()
  },
  getData() {
    var parmas = { pictextid: this.data.id, access_token: this.data.access_token };
    API.getPictxtDetail(parmas).then((res) => {
      var picData = res.data.data;
      this.setData({ picData: picData });
    }, (err) => {
      console.error(err);
    })
  },
  calling: function (e) {
    var tel = e.currentTarget.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel, //此号码并非真实电话号码，仅用于测试
    })
  },

})