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
        pointsInfo: {},
        pointsList: [],
        page: null,
        allPage: null,
        isMore: false,
    },
    onLoad: function(options) {
        var access_token = app.access_token || wx.getStorageSync('access_token');
        this.setData({ access_token });
    },
    onShow: function() {
        this.setData({
            page: null,
            allPage: null
        })
        this.getData();
    },
    onPullDownRefresh() {
        this.onShow();
    },
    onReachBottom() { //上拉加载更多
        console.log('上拉')
        this.getData();
    },
    getData: function() {
        var num = !!this.data.page ? this.data.page : 1;
        var isRest = (this.data.page === null) && (this.data.allPage === null);
        if (isRest || this.data.allPage > this.data.page) {
            if (this.data.allPage > this.data.page) {
                this.setData({
                    isMore: true
                })
            }
            API.getViPoints({ access_token: this.data.access_token, page: num })
                .then((res) => {
                    wx.stopPullDownRefresh() //停止下拉刷新
                    if (num == 1) {
                        this.data.pointsList = res.data.data.list;
                    } else {
                        this.data.pointsList = this.data.pointsList.concat(res.data.data.list)
                    }
                    var data = res.data.data;
                    this.setData({
                        isIndexLoad: false,
                        pointsInfo: data,
                        pointsList: this.data.pointsList,
                        page: data.nextPage,
                        allPage: data.allPage,
                        isMore: false,
                    })
                    wx.stopPullDownRefresh() //停止下拉刷新
                }, (err) => {
                    wx.stopPullDownRefresh() //停止下拉刷新
                    console.error(err);
                    app.showToast('请求数据错误');
                    this.setData({
                        isIndexLoad: false,
                        isMore: false,
                    })
                })
        }

    }
})
