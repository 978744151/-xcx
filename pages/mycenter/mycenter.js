var app = getApp(),
    wechat = require('../../utils/wechat.js'),
    utils = require('../../utils/util.js'),
    API = require('../../utils/api.js');

Page({
    data: {
        //调用系统颜色
        pagecolor: {
            bgcolor: app.currentbg.bgcolor,
            textcolor: app.currentbg.textcolor
        },
        //   userInfo: {},
        dir: {},
        isIndexLoad: true,
        access_token: null,
        isVip: 0,
        isAction: null,
        isReceive: 0,
        tel: null,
        myTel: '',
        isMy: true,
        isBottom: true,
        isOpen: null, //是否发放会员卡
        storeid: null,
        version: '',
         dialog: {
             color: app.currentbg.bgcolor,
             body: '',
             hidden: true
        },
    },

    onLoad: function (options) {
        var access_token = app.access_token || wx.getStorageSync('access_token'),
            version = app.version,
            storeid = app.shopId || wx.getStorageSync('shopId');
        this.setData({
            access_token, storeid, version
        })
        // wechat.getUserInfo().then((res) => {
        //     this.setData({
        //         userInfo: res.userInfo
        //     })
        // })
    },
    onShow: function () {
        this.getVipInfo();
        this.userinfo()
    },
    onHide() { },
    onPullDownRefresh() {
        this.getVipInfo();
        this.userinfo()
        wx.stopPullDownRefresh();
    },
    userinfo() {
      var userinfo = wx.getStorageSync('userinfo')
      this.setData({
        isVip: userinfo.isVip,
        money: userinfo.money,
        unicom: userinfo.unicom
      })
    },
    calling: function () { //打电话
        var phone = this.data.tel;
        utils.debugTel(this, phone);
    },
    getVipInfo: function () { //个人中心
        var access_token = this.data.access_token,
            storeid = this.data.storeid;
        var parmas = Object.assign({}, { access_token, storeid });
        API.getMyCenter(parmas).then((res) => {
            var data = res.data.data;
            var myTel = data.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
            this.setData({ isIndexLoad: false, myInfo: data, myTel });
        }, (err) => {

        })
    },
    linkVip: function () {
        // isAction 1 是未激活 0 是激活
        // isVip 0 不是vip 1 是vip
        // isReceive 0 未领取 1 是已领取
        var isVip = this.data.isVip,
            isReceive = this.data.isReceive,
            isAction = this.data.isAction;
        if (isVip == 0 && isReceive == 0) {
            wx.navigateTo({
                url: '/pages/vipwelcome/vipwelcome'
            })
        } else if (isVip == 0 && isReceive == 1 && isAction == 1) {
            wx.navigateTo({
                url: '/pages/vip/vip'
            })
        } else {
            wx.navigateTo({
                url: '/pages/vip/vip'
            })
        }
    },
    itemLink: function (e) {
        if (e.currentTarget.dataset.flag == 0) {
            wx.switchTab({ url: e.currentTarget.dataset.url, })
        } else {
            wx.navigateTo({ url: e.currentTarget.dataset.url, })
        }
    },
     /**
     * 点击会员卡色块
     */
    tapVip(e){
        const myInfo = this.data.myInfo,
            url = e.currentTarget.dataset.url,
            dialog = this.data.dialog,
            card = myInfo.card;

        if(card.iscard == 0){
            dialog.hidden = false;
            dialog.body = card.message;
            this.setData({dialog})
        }else{
            wx.navigateTo({
                url:url
            })
        }
    },
    /**
     *点击知道了
     */
    closePopover(){
        var dialog = this.data.dialog;
        dialog.hidden = true; 
        this.setData({dialog})
    }

})
