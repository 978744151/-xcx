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
        vipInfo: {},
        progressNum: 0,
        nextNum: null,
        allNum: null
    },
    onLoad: function(options) {
        var access_token = app.access_token || wx.getStorageSync('access_token');
        this.setData({ access_token })
    },
    onShow: function() {
        this.getData();
    },
    onPullDownRefresh() { //
        wx.stopPullDownRefresh();
    },
    getData: function() {
        API.getVipInfo({ access_token: this.data.access_token })
            .then((res) => {
                // console.log(res);
                var data = res.data.data,
                    progressNum = !!data.userInfo.nextLevel ? (data.userInfo.credit1 / data.userInfo.nextLevel.num) * 100 : 50,
                    nextNum = !!data.userInfo.nextLevel ? parseInt(data.userInfo.nextLevel.num - data.userInfo.credit1) : '',
                    allNum = !!data.userInfo.nextLevel ? data.userInfo.nextLevel.num : data.userInfo.credit1 * 2;
                this.setData({
                    isIndexLoad: false,
                    vipInfo: data,
                    progressNum,
                    nextNum,
                    allNum
                })
            }, (err) => {
                this.setData({
                    isIndexLoad: false,
                })
                console.error(err)
            })
    }
})
