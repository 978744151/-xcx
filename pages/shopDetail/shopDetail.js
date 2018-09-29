var app = getApp(), API = require('../../utils/api.js');
Page({
  data: {
    isIndexLoad: true
  },

  //页面加载
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: '商家信息', })
  },

  onReady: function () { },
  //  导航
  goMap: function () {
    var lat = parseFloat(this.data.shopInfo.storelat);
    var lng = parseFloat(this.data.shopInfo.storelng);
    wx.openLocation({
      latitude: lat,
      longitude: lng,
      name: this.data.shopInfo.storename,
      address: this.data.shopInfo.storeaddress,
      scale: 18
    })
  },
  // 电话
  calling: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.shopInfo.storetel,
      success: res => { },
      fail: res => { }
    })
  },
  // 评价图片预览
  imgView: function (e) {
    var urls = [];
    for (var i in this.data.shopInfo.storethumbs) {
      urls.push(this.data.shopInfo.storethumbs[i].image)
    }
    wx.previewImage({
      current: e.currentTarget.dataset.pic,
      urls: urls,
    })
  },
  // 营业知道
  storelicence: function (e) {
    var urls = [];
    urls.push(e.currentTarget.dataset.url);
    if (typeof urls[0] == 'undefined') {
      app.showToast('暂未上传营业执照', 'fail');
      return;
    }
    wx.previewImage({
      urls: urls,
    })
  },
  onShow: function () {
    var that = this, access_token = wx.getStorageSync('access_token');
    API.getIndexData({ access_token }).then((res) => {
      console.log(res.data.data)
      that.setData({ shopInfo: res.data.data.storeinfo, isIndexLoad: false });
    }, (err) => {
      console.log(err);
    })
  },

  onHide: function () { },

  onUnload: function () { },

  onPullDownRefresh: function () {
    this.onShow();
    wx.stopPullDownRefresh();
  },

  onReachBottom: function () { },

})