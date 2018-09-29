// pages/payIndex/payIndex.js

const app = getApp(),
    utils = require('../../utils/util.js'),
    API = require('../../utils/api.js');
var timeOut = null,timeOut2 = null;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        access_token: null,
        isLoading: true,         //首页加载
        showMessage: false,     //提示
        messageContent: '',     //提示文字
        isUpdate: false,
        data: {},
        time: 60,
        dialog:{
            isShow:true,
            title:'',
            content:'付款数字仅用于付款，为防止诈骗，请勿转发他人',
            confirmText:'知道了',
            color:'#f14949'
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const access_token = wx.getStorageSync('access_token');
        this.setData({
            access_token
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () { },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.setData({ time: 60 })
        clearTimeout(timeOut);
        this.getData();
        this.waitGetData();
    },
    /**
     * 获取数据
     */
    getData() {
        const access_token = this.data.access_token;
        API.getMyCenter({ access_token }).then((res) => {
            console.log(res.data)
            if (!res.data.status) {
                utils.showMessage(this, res.data.msg)
            }
            const { data } = res.data;
            this.setData({ data, isLoading: false, isUpdate: false })
        }, (err) => {
            this.setData({ isLoading: false, isUpdate: false })
            utils.showMessage(this, '请求接口错误');
            console.log(err);
        })
    },
    waitGetData() {
        var time = this.data.time;
        // console.log(time)
        if (time == 0) {
            this.setData({ time: 60 });
            this.getData();
            this.waitGetData();
        } else {
            timeOut = setTimeout(() => {
                this.setData({ time: time - 1 })
                this.waitGetData();
            }, 1000);
        }

        // wx.setData()
    },
    updateCode() {
        clearTimeout(timeOut2)
        if (this.data.isUpdate == false) {
          this.setData({ isUpdate: true });
          timeOut2 = setTimeout(()=>{
            this.onShow();
          },1000)
        }
        else {
            utils.showMessage(this, '请求太快');
        }
    },
    /**
     * 优惠
     */
    showDilaog(){
        var dialog = this.data.dialog;
        dialog.isShow = false;
        this.setData({ dialog})
    },
    /**
     * 点击 知道了
     */
    dialogSuccess(){
        this.showCode();
        var dialog = this.data.dialog;
        dialog.isShow = true;
        this.setData({ dialog })
    },
    /**
     * 显示数字条形码
     */
    showCode() {
        this.setData({ showCode: true })
    },
    /**
     * 隐藏数字条形码
     */
    closeCode() {
        this.setData({ showCode: false })
    },
    /**
     * 查看二维码大图
    */
    lookCode(e) {
        var curImage = e.currentTarget.dataset.imgsrc;
        // var curImage = this.data.testBg;
        wx.previewImage({
            current: curImage, // 当前显示图片的http链接
            urls: [curImage] // 需要预览的图片http链接列表
        })
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        clearTimeout(timeOut);
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () { },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.onShow();
        wx.stopPullDownRefresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () { },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () { }
})