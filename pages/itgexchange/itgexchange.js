// pages/integralList/integralList.js;
var app = getApp(),
    utils = require('../../utils/util.js'),
    API = require('../../utils/api.js');

Page({
    data: {
        id: '',
        color:app.currentbg,
        access_token: null,
        items: {}, //商品信息
        address: [],
        status: null,
        shoptel: '',
        isIndexLoad: true
    },
    onLoad: function(options) {
        var id = options.id || '',
            shoptel = wx.getStorageSync('tel'),
            access_token = app.access_token || wx.getStorageSync('access_token');
        this.setData({ id, access_token, shoptel })
    },
    onShow() {
        this.getData();
    },
    onPullDownRefresh() {
        this.onShow()
    },
    getData() {
        var parmas = { access_token: this.data.access_token, tid: this.data.id };
        API.getExchangeOrder(parmas).then((res) => {
            var data = res.data.data;
            let { items, address, status } = data;
            this.setData({ items, address, status, isIndexLoad: false });
            wx.stopPullDownRefresh() //停止下拉刷新
        }, (err) => {
            console.error(err);
            this.setData({ isIndexLoad: false })
            wx.stopPullDownRefresh() //停止下拉刷新
            app.showToast('请求数据错误')
        })
    },
    calling: function() { //打电话     
        var phone = this.data.shoptel;
        utils.debugTel(this,phone)
        // wx.makePhoneCall({
        //     phoneNumber: this.data.shoptel //此号码并非真实电话号码，仅用于测试
        // })
    },
    lookCode(e) {
        var curImage = e.currentTarget.dataset.imgsrc;
        wx.previewImage({
            current: curImage, // 当前显示图片的http链接
            urls: [curImage] // 需要预览的图片http链接列表
        })
    }
})
