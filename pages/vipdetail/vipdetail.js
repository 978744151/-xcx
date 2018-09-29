var app = getApp(),
    API = require('../../utils/api.js');

Page({
    data: {
        //调用系统颜色
        pagecolor: {
            bgcolor: app.currentbg.bgcolor,
            textcolor: app.currentbg.textcolor
        },
        access_token: null,
        powers: [],
        description: [],
        server: [],
        validity: '',
        tel: '',
        isIndexLoad: true
    },
    onLoad: function (options) {
        var access_token = app.access_token || wx.getStorageSync('access_token');
        this.setData({
            access_token: access_token
        })
        this.getData();
    },
    onShow: function () {

    },
    onPullDownRefresh() { //
        wx.stopPullDownRefresh();
    },
    getData: function () {
        var parmas = { 'access_token': this.data.access_token };
        API.getVipDetail(parmas).then((res) => {
            var data = res.data.data,
                pagecolor = this.data.pagecolor;
            const { powers, description, server, validity, tel, color } = data;
            pagecolor.bgcolor = color;
            this.setData({
                powers,
                description,
                server,
                validity,
                tel,
                isIndexLoad: false,
                pagecolor
            })
            wx.stopPullDownRefresh() //停止下拉刷新
        }, (err) => {
            console.error(err);
            this.setData({
                isIndexLoad: false,
            })
            wx.stopPullDownRefresh() //停止下拉刷新
        })
    },
    calling: function () {
        wx.makePhoneCall({
            phoneNumber: this.data.tel //此号码并非真实电话号码，仅用于测试
        })
    },
})
