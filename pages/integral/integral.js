// pages/integral/integral.js
var app = getApp(),
    API = require('../../utils/api.js');
Page({
    data: {
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 300,
        access_token: null,
        isIndexLoad: true,
        isMore: false,
        imgUrls: 'https://pic.repaiapp.com/static/png/20171205/21/1512480744491685057.png',
        list: [],
        nextPage: null,
        allPage: null,
        count: null,
        isEnd: false,
        mycredit: null,
        pageError: false,
        errorMsg: '',
        isCodebg: false,
        istemp: 'intergralbg',
        newList: [],
        isDebug: false,
        debugtxt: '积分商城'
    },
    onLoad: function (options) {
        var access_token = app.access_token || wx.getStorageSync('access_token'),
            modeInfo = wx.getStorageSync('modeInfo') || {};
        this.setData({ access_token });
        if (modeInfo.hasOwnProperty('is_score') && modeInfo.is_score == 0) {
            wx.setNavigationBarColor({
                frontColor: '#ffffff',
                backgroundColor: '#28292b',
            })
            this.setData({ isIndexLoad: false, isDebug: true });
            return;
        }
    },
    onShow() {
        this.setData({
            nextPage: null,
            allPage: null,
            isEnd: false,
        })
        this.getData();
    },
    onPullDownRefresh() {
        this.onShow();
    },
    onReachBottom() { //上拉加载更多
        console.log('上拉加载更多')
        this.getData();
    },
    getData() {
        var page = !!this.data.nextPage ? this.data.nextPage : 1;
        var isRest = (this.data.nextPage === null) && (this.data.allPage === null);
        if ((isRest || this.data.allPage >= this.data.nextPage) && !this.data.isEnd) {
            if (this.data.allPage >= this.data.nextPage) {
                this.setData({
                    isMore: true
                })
            }
            if (app.modeInfo.is_score == 0) {
                this.setData({ isIndexLoad: false, isCodebg: true });
                return;
            }
            API.getIntegarlIndex({ access_token: this.data.access_token, page, size: 10 }).then((res) => {
                if (res.data.status == false) {
                    this.setData({
                        pageError: true,
                        isIndexLoad: false,
                        errorMsg: res.data.msg
                    })
                } else {
                    var data = res.data.data;
                    let { list, nextPage, allPage, count, mycredit, isEnd } = data;
                    list = isRest ? list : this.data.list.concat(list);
                    var newList = [];//list.slice(0, 6)
                    this.setData({
                        list,
                        nextPage,
                        allPage,
                        count,
                        mycredit,
                        isEnd,
                        isIndexLoad: false,
                        isMore: false,
                        newList,
                    })
                    wx.stopPullDownRefresh() //停止下拉刷新
                }

            }, (err) => {
                this.setData({ isIndexLoad: false, isMore: false, });
                wx.stopPullDownRefresh() //停止下拉刷新
                console.error(err);
                app.showToast('请求接口错误');
            })
        }
    },
    reback: function () {
        wx.navigateBack({ delta: 1 })
    },
    Myorder: function () {

    }
})