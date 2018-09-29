/**
 * 未授权页面 nolocation
 * zy 2017-05-25
 */

var app = getApp(),
    wechat = require('../../utils/wechat.js');
Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        tiptxt: '申请获得你的公开信息（昵称、头像等）',
        btntxt: '微信授权',
        head_img:'',
        nick_name:''
    },
    onLoad: function (options) { 
      var that=this;
      var type = options.type;
      this.setData({
          come: type
      })
      wx.request({
        url: 'https://op.tiantianremai.cn/v1/wxapp/getWxappInfoJsonByShopId?table=1&shopId='+app.shopId,
        method: 'post',
        success: function (res) {
          console.log(res.data.data.data.head_img,'res')
          that.setData({
            head_img: res.data.data.data.head_img,
            nick_name: res.data.data.data.nick_name
          })
        }
    })
    },
    onShow: function () { 
      this.setData({
        head_img: this.data.head_img
      })
     },
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh() //停止下拉刷新
    },
    bindGetUserInfo: function (e) {
      console.log(e)
        console.log('用户授权', e);
        let qdl = this.data.qdl;
        if (e.detail.errMsg == 'getUserInfo:ok') {
            if (this.data.come == 'fast') {
                wx.login({
                    success: function (res) {
                        console.log(res)
                        app.ajaxUser(res.code, function () {
                            wx.navigateTo({
                                url: '/pages/pay/pay',
                            })
                            return
                        })
                    }
                });
            }else{
                wx.switchTab({ url: "/pages/index/index" })
            }
        } else {
            wx.reLaunch({ url: '/pages/setting/setting', })
        }
    },
})