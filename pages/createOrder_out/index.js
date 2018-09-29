// pages/createOrder_out/index.js
let app = getApp(),
  API = require('../../utils/api.js'),
  utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deaddress:false,
    isHidden: true,
    peoplenumber:[1,2,3,4,5,6,7,8,9,10,11],
    pagecolor: {
      bgcolor: app.currentbg.bgcolor,
      textcolor: app.currentbg.textcolor,
      linecolor: '#f14949',
    },
  },
  //点击出弹框
  clickpeople: function (e) { //选择人数
    var thisid = e.target.dataset.id
    this.setData({ changeNum: thisid })
  },
  tcpeople: function () { //点击立即下单弹出层
    this.setData({ isHidden: false, wHeight: this.data.windowHeight, isChecked: false })
  },
  tcfalse: function () { //点击取消或者遮罩关闭层
    this.setData({ isHidden: true, wHeight: 'auto' });
  },
  tapYes() { //点击确定选择人数
    const changeNum = this.data.changeNum,
      order_people = this.data.order_people;
    if (changeNum > 0) {
      this.setData({ counts: changeNum });
      this.tcfalse();
      if (!(order_people > 0)) {
        this.createdOrder();
      }
    } else {
      this.setData({ changeNum: 0, })
    }
  },
  //地址
  tapAddress(){
    wx.navigateTo({
      url: '/pages/address_out/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})