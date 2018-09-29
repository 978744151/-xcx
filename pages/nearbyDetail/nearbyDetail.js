var app = getApp(),
    API = require('../../utils/api.js'),
    utils = require('../../utils/util.js');
Page({
    data: {
        //调用系统颜色
        pagecolor: {
            bgcolor: app.currentbg.bgcolor,
            textcolor: app.currentbg.textcolor
        },
        access_token: null,
        id: '',
        shopData: {},
        isLoading: true
    },

    onLoad: function(options) {
        var id = options.id || '',
            access_token = app.access_token || wx.getStorageSync('access_token');
        this.setData({ id, access_token })
    },
    onShow: function() {
        this.getData()
    },
    onPullDownRefresh() {
        this.getData()
        wx.stopPullDownRefresh();
    },
    getData() {
        var parmas = { sid: this.data.id, access_token: this.data.access_token };
        API.getShopDetail(parmas).then((res) => {
            var shopData = res.data.data;
            this.setData({ shopData, isLoading: false });
        }, (err) => {
            console.error(err);
            this.setData({ isLoading: false })
        })
    },
    calling(e) { //打电话
        var phone = this.data.shopData.tel;
        utils.debugTel(this,phone)
    },
    tapMap: function() { //点击地图导航
        var options = {
            lat: this.data.shopData.lat,
            lng: this.data.shopData.lng,
            name: this.data.shopData.title,
            address: this.data.shopData.address
        }
        utils.goMap(options);
    },

})
