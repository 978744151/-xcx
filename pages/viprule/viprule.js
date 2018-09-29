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
        isIndexLoad: true,
        ruleInfo: {},
    },
    onLoad: function(options) {
        var access_token = app.access_token || wx.getStorageSync('access_token');
        this.setData({ access_token });
    },
    onShow: function() {
        this.getData();
    },
    onPullDownRefresh() { //
        wx.stopPullDownRefresh();
    },
    getData: function() {
        API.getVipRule({ access_token: this.data.access_token })
            .then((res) => {
                console.log(res);
                this.setData({
                    ruleInfo: res.data.data,
                    isIndexLoad: false,
                })
            }, (err) => {
                console.error(err);
                this.setData({
                    isIndexLoad: false
                })
            })
    }
})
