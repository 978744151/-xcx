var API = require('../../utils/api.js');
Page({
   data: {
      isIndexLoad:true
   },
   imgView: function (e) {
      var urls=[];
      for (var i in this.data.photos){
         urls.push(this.data.photos[i].image)
      }
      wx.previewImage({
         current: e.currentTarget.dataset.pic,
         urls: urls,
      })
   },
   onLoad: function (options) {
      wx.setNavigationBarTitle({title: '商家相册',})
    },
   onShow: function () {
      var that = this, access_token = wx.getStorageSync('access_token');
      API.getIndexData({ access_token }).then((res) => {
         that.setData({ photos: res.data.data.storeinfo.storethumbs, isIndexLoad: false });
      }, (err) => {
         console.log(err);
      })
    },
   onHide: function () { },
   onUnload: function () { },
   onPullDownRefresh: function () { 
      this.onShow();
      wx.stopPullDownRefresh(); },
   onReachBottom: function () { },
})