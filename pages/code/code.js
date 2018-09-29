//index.js
//获取应用实例
var app = getApp(),
    API = require('../../utils/api.js'),
    wechat = require('../../utils/wechat.js'),
    utils = require('../../utils/util.js');



Page({
    data: {
        //商店信息
        shopinfo: {},
        //用户信息
        //调用系统颜色
        pagecolor: {
            bgcolor: app.currentbg.bgcolor,
            textcolor: app.currentbg.textcolor
        },
        //桌号
        tableid: null,
        isLoading: true,
        isPowerHidden: true,
        powerBtnColor: app.currentbg.bgcolor,
        isBottom: true,
        is_menu: null,
        title: '点餐', //页面抬头
        powerDialogTip: '小店点餐模块正在调试中，即将上线',
        isCodebg: false,
        istemp: 'codebg',
        showMessage: false,
        access_token: null,
        path: '',
        dialog: {
            color: app.currentbg.bgcolor,
            text: '该菜品已被同桌删除',
            hidden: true
        },
        messageContent: '',
        isDebug: false,
        debugtxt: '点餐',
        is_show: null,
        technologySupport:null,
    },
    onLoad: function () {
        var access_token = wx.getStorageSync('access_token') || app.access_token;
        this.setData({ access_token })

        wx.setNavigationBarTitle({
            title: '点餐买单'
        })
    },
    onPullDownRefresh() {
        this.onShow();
        wx.stopPullDownRefresh() //停止下拉刷新
    },
    onShow: function () { //首页展示
        console.log(wx.getStorageSync('access_token'))
        var access_token = this.data.access_token;
        if (!!access_token) {
            var parmas = { access_token };
            this.getData(parmas);
        } else {
            app.checkSession((parmas) => {
                this.getData(parmas);
            });
        }

    },
    shopscan: function () { //扫描二维码
        var access_token = this.data.access_token,
            dialog = this.data.dialog;

        if (this.data.is_show == 1) {
            wechat.scanCode(false).then((res) => {
                console.log(res);
                if (res.hasOwnProperty('path')) {
                    var falg = (res.path).indexOf('/pages/'),
                        path = res.path;

                    if (falg > -1) {
                        // var storeid = path.split('&')[1].split('=')[1];
                        // var jsS = path.split('?')[1];
                        // console.log(tablesid)
                        // if (storeid == app.shopId){
                        wx.redirectTo({ url: `${path}&storeid=${app.shopId}` })
                        // }

                    } else {
                        utils.showMessage(this, '未能识别商家二维码,联系服务员');
                    }
                } else {
                    utils.showMessage(this, '请扫描正确的二维码');
                }
            }, (fail) => {
                if (fail.errMsg == 'scanCode:fail cancel') {
                    utils.showMessage(this, '已取消扫码');
                } else {
                    utils.showMessage(this, '请扫描正确的二维码');
                }
            })
        } else {
            dialog.text = '本店暂停营业! 如有不便敬请谅解';
            dialog.hidden = false;
            this.setData({ dialog })
        }

    },
    getData: function (parmas) {
        API.getIndexData(parmas).then((res) => {
            var data = res.data.data;
            this.setData({
                shopinfo: res.data.data.storeinfo,
                technologySupport: res.data.data.technologySupport,
                is_show: res.data.data.storeinfo.is_show,
                isLoading: false,
            })
        }, (err) => {
        })
    },
    iKown() {
        var dialog = this.data.dialog;
        dialog.hidden = true;

        if (this.data.is_show == 1) {
            this.setData({ dialog })
        } else {
            wx.switchTab({
                url: '/pages/index/index'
            })
        }
    },
    backPage() {
        if (getCurrentPages().length > 1) {
            wx.navigateBack({
                delta: 1
            })
        } else {
            wx.switchTab({
                url: '/pages/index/index'
            })
        }
    },
    reback: function () {
        wx.navigateBack({ delta: 1 })
    },
})