// pages/Forrecord/Forrecord.js
var app = getApp(),
    API = require('../../utils/api.js'),
    utils = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        access_token: null,
        isIndexLoad: true,
        list: [],
        nextPage: null,
        allPage: null,
        count: null,
        isEnd: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var access_token = app.access_token || wx.getStorageSync('access_token');
        this.setData({ access_token })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.setData({
            nextPage: null,
            allPage: null,
            isEnd:false,
        })
        this.getData();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        this.onShow();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() { //上拉加载更多
        console.log('上拉加载更多')
        this.getData();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    getData: function() { //获取兑换列表信息
        var page = !!this.data.nextPage ? this.data.nextPage : 1;
        var isRest = (this.data.nextPage === null) && (this.data.allPage === null);
        if ((isRest || this.data.allPage >= this.data.nextPage) && !this.data.isEnd) {
            if (this.data.allPage >= this.data.nextPage) {
                this.setData({
                    isMore: true
                })
            }

            API.getExchangeGoodsList({ access_token: this.data.access_token, page, size: 10 }).then((res) => {
                var data = res.data.data;
                let { list, nextPage, allPage, count, isEnd } = data;

                list = isRest ? list : this.data.list.concat(list);
                this.setData({
                    list,
                    nextPage,
                    allPage,
                    count,
                    isEnd,
                    isIndexLoad: false,
                    isMore: false,
                })
                wx.stopPullDownRefresh() //停止下拉刷新
            }, (err) => {
                this.setData({ isIndexLoad: false, isMore: false, });
                wx.stopPullDownRefresh() //停止下拉刷新
                console.error(err);
                app.showToast('请求接口错误');
            })
        }
    }
})
