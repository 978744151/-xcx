var app = getApp()
var util = require('../../utils/util.js')
Page({
  data: {
    isAdd: false,
    addressList: false,
    editInfo: {},
    showMessage: false,
    messageContent: '',
  },

  onLoad: function (e) {
    var that = this,
      access_token = app._access_token || wx.getStorageSync('access_token');
    that.setData({
      access_token: access_token 
    })
    that.getData()
  },
  onShow:function(){
    this.getData()
  },
  getData:function(){
    var that=this;
    wx.request({
      url: app._mhost + "/addressInfo?access_token=" + that.data.access_token,
      method: 'GET',
      dataType: 'json',
      data: {},
      success: function (res) {
        var data = res.data.data;
        var hasAddr = false;
        if (!util.isEmpty(data)) {
          hasAddr = true
        } else {
          data = {}
        }
        that.setData({
          addressList: data,
          hasAddr: hasAddr
        })
      },
      fail: function (res) { },
      complete: function (res) {
        wx.hideLoading()
      }
    })
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  
  delAddr: function (e) {
    wx.showLoading({
      'title': '提交中',
      'mask': true
    })
    var thisId = e.currentTarget.dataset.aid;
    var that = this;
    wx.request({
      url: app._mhost + "/delAddress?access_token=" + that.data.access_token,
      method: 'GET',
      data: {
        id: thisId
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.status==0) {
          var newList = that.data.addressList;
          delete newList[thisId];
          var hasAddr = that.data.hasAddr;
          if (util.isEmpty(newList)) {
            hasAddr = false
          }
          that.setData({
            showEdit: false,
            isAdd: false,
            editInfo: {},
            addressList: newList,
            hasAddr: hasAddr
          })
          this.getData()
        } else {
          app.showToast(res.data.msg)
        }
      },
      fail: function (res) {
        wx.hideLoading();
        app.showToast("网络错误")
      },
      complete: function (res) { }
    })
  },
  //新增地址
  tapNewAddr:function(){
    wx.navigateTo({
      url: '../address/address',
    })
  },
  //编辑地址
  editAddress: function(e){
    console.log(e)
    wx.navigateTo({
      url: '../address/address?id=' + e.currentTarget.dataset.aid + '&phone=' + e.currentTarget.dataset.phone + '&contactname=' + e.currentTarget.dataset.contactname + '&lng=' + e.currentTarget.dataset.lng + '&lat=' + e.currentTarget.dataset.lat + '&bigadr=' + e.currentTarget.dataset.bigadr + '&tagname=' + e.currentTarget.dataset.tagname + '&detailadr=' + e.currentTarget.dataset.detailadr + '&tag=' + e.currentTarget.dataset.tag,
    })
  },
  redioTap: function (e) {
    console.log(e, 'eee')
    if (this.data.isVip) {
      return;
    }
    if (e.type == "tap") {
      var thisId = e.currentTarget.dataset.aid;
    } else if (e.type == "change") {
      var thisId = e.detail.value;
    } else {
      return;
    }
    var thisInfo = this.data.addressList;
    if (thisInfo[thisId].default == 1) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      var that = this;
      wx.request({
        url: app._mhost + "/setDefaultAddr?access_token=" + this.data.access_token,
        method: 'GET',
        data: {
          id: thisId
        },
        success: function (res) {
          wx.hideLoading();
          if (res.data.status===0) {
            wx.navigateBack({
              delta: 1
            })
          } else {
            wx.showToast({
              title: res.data.msg
            })
          }
        },
        fail: function (res) {
          wx.hideLoading();
          wx.showToast({
            title: "网络错误"
          })
        },
        complete: function (res) { }
      })
    }
    console.log(e);
  },
  
})