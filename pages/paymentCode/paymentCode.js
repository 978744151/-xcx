var app = getApp(),
    API = require('../../utils/api.js'),
    wechat = require('../../utils/wechat.js'),
    isHidden = false,
    utils = require('../../utils/util.js');


Page({

    /**
     * 页面的初始数据
     */
    data: {
        scrollHeight: null,
        isLoading: true,
        access_token: null,
        bg: 'https://pic.repaiapp.com/pic/f0/bc/f3/f0bcf3a67fcaa79760047890e448838092209d20.png',
        // testBg: "http://qr.api.cli.im/qr?data=831043459663061472&level=H&transparent=false&bgcolor=%23ffffff&forecolor=%23000000&blockpixel=12&marginblock=1&logourl=&size=280&kid=cliim&key=0f5c5c65dbd7fb9d806a019a0fd38ed7",
        infoData: {},
        second: 60,
        initimer: 60,
        pert: 0,
        showCode: false,
        isVipHidden: true,
        showDialog: false,
        isAction:false,
        pagecolor: {
            bgcolor: '#279694',
            textcolor: app.currentbg.textcolor
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var scrollHeight = utils.mathScorllHeight(0),
            access_token = app.access_token || wx.getStorageSync('access_token');
        this.setData({
            scrollHeight,
            access_token
        })
        wechat.getUserInfo().then((res) => {
            this.setData({
                userInfo: res.userInfo
            })
        })

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
            second: 60,
            initimer: 60,
            pert: 0
        })
        this.getData();
        isHidden = false;
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        isHidden = true;
        this.setData({
            second: 60,
            initimer: 60,
            pert: 0
        })
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        isHidden = true;
        this.setData({
            second: 60,
            initimer: 60,
            pert: 0
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        wx.showShareMenu({
            withShareTicket: true
        })
        var that = this;
        return {
            title: '撒椒',
            path: '/pages/paymentCode/paymentCode',
            success: function (res) {
                console.log(res);
                app.showToast("转发成功", 'success')
            },
            fail: function (res) {
                utils.showMessage(that, '取消转发')
            }
        }
    },
    /**
     * 获取数据
     */
    getData() {
        if (!!this.data.access_token) {
            this.getPayData({ 'access_token': this.data.access_token })
        } else {
            app.checkSession((params) => {
                this.setData({ access_token: params.access_token })
                this.getPayData(params)
            })
        }
    },
    getPayData(params){
        API.getPaymentCode(params).then((res) => {
            // console.log(res);
            let infoData = res.data.data;
            if (infoData.isVip == 0) {
                infoData.codeStr = '';
                var isAction = !!infoData.isReceive
                this.setData({ infoData, isLoading: false, isVipHidden: false,isAction });
            } else {
                infoData.codeStr = utils.splitStar(infoData.code, 3, 4);
                this.countdown();
                this.setData({ infoData, isLoading: false });
            }
        }, (err) => {
            this.setData({ isLoading: false });
        })
    },
    /**
     * 查看大图
     */
    lookCode(e) {
        var curImage = e.currentTarget.dataset.imgsrc;
        // var curImage = this.data.testBg;
        wx.previewImage({
            current: curImage, // 当前显示图片的http链接
            urls: [curImage] // 需要预览的图片http链接列表
        })
    },
    showCCode() {
        this.setData({ showCode: true })
    },
    countdown() {
        if (!isHidden) {
            var second = this.data.second
            if (second == 0) {
                this.setData({ second: this.data.initimer - second, pert: 0 })

                this.getData();

                return;
            }
            setTimeout(() => {
                var pert = Math.round(((this.data.initimer - second) / this.data.initimer) * 100)
                this.setData({
                    second: second - 1,
                    pert
                });
                this.countdown();
            }, 1000)
        }
    },
    /**
     * 去领取会员
     */
    goGetVip() {
        this.setData({ isVipHidden: true });
        if (this.data.infoData.isReceive == 1) {
            wx.redirectTo({
                url: '/pages/vip/vip'
            })
        } else {
            wx.redirectTo({
                url: '/pages/vipwelcome/vipwelcome'
            })
        }

    },
    closeCode() {
        this.setData({ showCode: false })
    },
    showDialog() {
        this.setData({ showDialog: true })
    },
    closeDialog() {
        this.setData({ showDialog: false })
    }
})