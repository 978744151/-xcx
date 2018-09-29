var app = getApp(),
    API = require('../../utils/api.js'),
    wechat = require('../../utils/wechat.js');

Page({
    data: {
        //调用系统颜色
        pagecolor: {
            bgcolor: app.currentbg.bgcolor,
            textcolor: app.currentbg.textcolor
        },
        access_token: null,
        vipInfo: {},
        userInfo: {},
        isIndexLoad: true,
        isBottom: true
    },
    onLoad: function(options) {
        var vipInfo = wx.getStorageSync('vipInfo') || {},
            access_token = app.access_token || wx.getStorageSync('access_token');
        this.setData({
            vipInfo,
            access_token
        })
        wechat.getUserInfo().then((res) => {
            this.setData({
                userInfo: res.userInfo,
            })
        })
    },
    onShow: function() {
        this.getVipInfo();　
    },
    onPullDownRefresh() {
        this.getVipInfo();　　
    },
    getVipInfo: function() {
        var parmas = { 'access_token': this.data.access_token };
        API.getUserCard(parmas).then((res) => {
            var data = res.data.data;
            this.setData({
                vipInfo: data,
                isIndexLoad: false,
            })
            wx.stopPullDownRefresh() //停止下拉刷新
        }, (err) => {
            this.setData({
                isIndexLoad: false,
            })
            wx.stopPullDownRefresh() //停止下拉刷新
        })
    },
    backVip() {
        wx.navigateBack({
            delta: 1
        })
    }
})
