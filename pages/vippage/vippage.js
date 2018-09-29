var app = getApp(),
    wechat = require('../../utils/wechat.js'),
    API = require('../../utils/api.js');
Page({
    data: {
        //调用系统颜色
        pagecolor: {
            bgcolor: app.currentbg.bgcolor,
            textcolor: app.currentbg.textcolor
        },
        // title: '香天下',
        userInfo: {},
        isIndexLoad: true,
        access_token: null,
        data: {},
        isBottom: true
    },

    onLoad: function(options) {
        var access_token = app.access_token || wx.getStorageSync('access_token');
        this.setData({ access_token })
    },
    onShow: function() {
        this.getVipInfo();
    },
    onHide() {
        this.setData({ isIndexLoad: true })
    },
    onPullDownRefresh() {　　
        this.getVipInfo();
        wx.stopPullDownRefresh();
    },
    getVipInfo: function() { //获取会员信息  
        var parmas = { 'access_token': this.data.access_token };
        API.getVIPUserInfo(parmas).then((res) => {
            const data = res.data.data;
            this.setData({ data, isIndexLoad: false })
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
        }, (err) => {
            console.error(err);
            this.setData({
                isIndexLoad: false
            })
            wx.hideNavigationBarLoading() //完成停止加载
            wx.stopPullDownRefresh() //停止下拉刷新
        })
    }
})
