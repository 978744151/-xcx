var app = getApp(),
    API = require('../../utils/api.js');


Page({

    /**
     * 页面的初始数据
     */
    data: {
        //调用系统颜色
        pagecolor: {
            bgcolor: app.currentbg.bgcolor,
            textcolor: app.currentbg.textcolor
        },
        wH: null,
        cardData: {},
        isLoading: true,
        isPowerHidden: true,
        tyPowerTxt: '',
        powerColor: '',
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
        var access_token = app.access_token || wx.getStorageSync('access_token');

        API.getVipLevel({
            access_token: access_token
        }).then((res) => {
            const cardData = res.data.data;
            this.setData({
                cardData,
                isLoading: false,
                powerColor: cardData.color
            });
            wx.stopPullDownRefresh();
        }, (err) => {
            this.setData({
                isLoading: false
            })
            wx.stopPullDownRefresh();
        })
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
        this.onShow();
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

    },
    closeDialog() { //关闭弹窗
        this.setData({ isPowerHidden: true })
    },
    showDialog(e) { //展示弹窗
        var tyPowerTxt = e.currentTarget.dataset.tip,
            lock = e.currentTarget.dataset.lock;
        // console.log(e);
        if(!lock){
            this.setData({ isPowerHidden: false, tyPowerTxt })
        }
        
    }
})