var app = getApp(),
    utils = require('../../utils/util.js'),
    API = require('../../utils/api.js');

Page({
    data: {
        //调用系统颜色
        pagecolor: {
            bgcolor: app.currentbg.bgcolor,
            textcolor: app.currentbg.textcolor
        },
        vipInfo: {},
        access_token: null,
        isIndexLoad: true,
        isOpen: null,
        isCodebg: false,
        isBottom: false,
        istemp: 'vipbg',
        dir: {},
        isDebug: false,
        debugtxt: '会员卡',
        dialog: {
            color: app.currentbg.bgcolor,
            text: '该菜品已被同桌删除',
            hidden: true
        },
    },
    onLoad: function (options) {
        var access_token = app.access_token || wx.getStorageSync('access_token'),
            modeInfo = wx.getStorageSync('modeInfo') || {},
            dir = wx.getStorageSync('dir') || {};

        if (modeInfo.hasOwnProperty('is_vip') && modeInfo.is_vip == 0) {
            wx.setNavigationBarColor({
                frontColor: '#ffffff',
                backgroundColor: '#28292b',
            })
            this.setData({ isLoading: false, isDebug: true });
            return;
        }

        this.setData({
            access_token: access_token,
            dir: dir
        })

    },
    onShow: function () {
        var that = this;
        this.getVipInfo();
    },
    onHide: function () {
        this.setData({ isIndexLoad: true })
    },
    onPullDownRefresh() {
        this.getVipInfo();
    },
    onReachBottom() {

    },
    getVipInfo: function () {
        var pagecolor = this.data.pagecolor;
        var parmas = Object.assign({}, { 'access_token': this.data.access_token }, this.data.dir);
        // var parmas = { 'access_token': this.data.access_token };
        API.getMyCenter(parmas).then((res) => {
            var data = res.data.data;
            pagecolor.bgcolor = data.color;
            this.setData({ pagecolor })
            if (data.isVip == 0) {
                this.setData({ isIndexLoad: false, isCodebg: true });
                // return
            }
            if (data.isOpen == 0) {
                this.setData({
                    isOpen: 0,
                    isIndexLoad: false
                })
            } else {
                pagecolor.textcolor = data.cardstatue == 0 ? '#cbcbcb' : pagecolor.textcolor;
                this.setData({
                    vipInfo: data,
                    isIndexLoad: false,
                    pagecolor
                })  
                console.log(this.data.vipInfo)             
            }         
            wx.stopPullDownRefresh() //停止下拉刷新
        }, (err) => {
            console.error(err);
            this.setData({
                isIndexLoad: false,
            })
            wx.stopPullDownRefresh() //停止下拉刷新
        })
    },
    calling: function (e) {
        var phone = e.currentTarget.dataset.tel;
        utils.debugTel(this,phone)
    },
    linkCenter() {
        app.isMyCenter = 1;
        wx.switchTab({
            url: '/pages/mycenter/mycenter'
        })
    },
    linkCode() {
        if(this.data.vipInfo.cardstatue == 0){
            this.showDialog();
            return;
        }

        if (this.data.vipInfo.isVip == 1) {
            wx.navigateTo({
                url: '/pages/vipqrcode/vipqrcode'
            })
        }
    },
    goMap() {
        var options = {
            lat: this.data.vipInfo.lat,
            lng: this.data.vipInfo.lng,
            name: this.data.vipInfo.shopname,
            address: this.data.vipInfo.shopaddress
        }
        utils.goMap(options);
    },
    reback: function () {
        wx.navigateBack({ delta: 1 })
    },
    ItemLink(evnt) {
        if (this.data.vipInfo.cardstatue == 0) {
            this.showDialog();
        } else {
            wx.navigateTo({
                url: evnt.currentTarget.dataset.url
            })
        }

    },
    showDialog() {
        var dialog = this.data.dialog;
        dialog.text = '该会员卡已被禁用，如有疑问请联系商家';
        dialog.hidden = false;
        this.setData({ dialog })
    },
    iKown() {
        var dialog = this.data.dialog;
        dialog.hidden = true;
        this.setData({ dialog })
    }
})
