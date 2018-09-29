var app = getApp(),
    API = require('../../utils/api.js'),
    socket = require('../../utils/socket.js'),
    timer = null,
    _flagDialog = 'open';

Page({
    data: {
        //调用系统颜色
        pagecolor: {
            bgcolor: '#f14949',
            textcolor: app.currentbg.textcolor,
            linecolor: '#f14949',
        },
        isPrew: false,
        isScroll: true,
        display: 'block',
        orderItems: {},
        flagDialog: 'close',
        isLoading: true,
        orderid: null,
        tablesid: null,
        access_token: null,
        addDish: 0,
        wHeight: 0, //屏幕高度
        isSuccess: false,
        animationData: {}, //成功弹窗
        successData: {},//支付成功信息数据
        tabArr: {}, // 星星
        uid: null,
        addTempCart: {},
        d_type: '',
        dialog: {
            color: app.currentbg.bgcolor,
            text: '购物车已被同桌删除',
            hidden: true
        },
        defaultDialog: {
            isShow: true,
            title: '',
            content: '购物车已被提交,是否前往订单详情?',
            cancelText: '取消',
            confirmText: '确认',
            color: app.currentbg.bgcolor,
        },
        isPayDetailDialog: false, //虚拟支付明细t弹窗 Boolean
        totalprice:null
    },
    onLoad: function (options) {
        var orderid = options.orderid || wx.getStorageSync('orderid'),
            tablesid = options.tablesid || wx.getStorageSync('tablesid'),
            access_token = wx.getStorageSync('access_token') || app.access_token,
            uid = wx.getStorageSync('uid') || '',
            from = options.from || 0;

        this.setData({
            orderid,
            tablesid,
            access_token,
            uid,
            from,
        })


    },
    onShow: function () {
        this.getData();
    },
    getData: function () { //获取订单详情页数据
        let access_token = this.data.access_token,
            tablesid = this.data.tablesid,
            orderid = this.data.orderid,
            parmas = { 'tablesid': tablesid, 'orderid': orderid, 'access_token': access_token };
            
        API.getOrderDetail(parmas).then((res) => {
            wx.hideLoading()
            var _data = res.data.data,
                 cutlery_money = res.data.data.cutlery_money || 0 
          var totalprice = Number(res.data.data.totalprice) + Number(cutlery_money)
            this.setData({
                orderItems: _data,
                isLoading: false,
                cutlery_money,
                totalprice
            });
        }, (err) => {
            wx.hideLoading()
            console.log(`请求订单详情页失败${err}`);
            this.setData({
                isLoading: false
            })
        })
    },
    showComfirmDialog(data) {
        if (data.submitorder) {
            const tablesid = this.data.tablesid;
            let defaultDialog = this.data.defaultDialog;
            defaultDialog.isShow = false;
            defaultDialog.content = '购物车已被提交,是否刷新页面?';
            defaultDialog.cancelText = '';
            defaultDialog.confirmText = '知道了';
            const detailURI = `/pages/orderDetail/orderDetail?orderid=${data.orderid}&tablesid=${tablesid}`
            this.setData({
                defaultDialog,
                detailURI,
                submitorder: true,
                flagDialog: 'close'
            })
        }
    },
    dialogSuccess() {
        let defaultDialog = this.data.defaultDialog;
        defaultDialog.isShow = true;
        this.setData({ defaultDialog })
        this.getData();
    },
    onPullDownRefresh() { //下拉刷新
        this.onShow();
        wx.stopPullDownRefresh() //停止下拉刷新
    },
    onReachBottom() {
        // this.onShow();
        wx.stopPullDownRefresh();
    },
    onHide: function () {
        console.log('onhide');
    },
    onUnload: function () { //卸载页面
        console.log('onUnload')
        app.isSuccess = 0;
        this.onHide();
    },
    affknow: function () {
        this.getData();
        this.setData({
            display: 'none',
            flagDialog: 'close',
        })
        wx.setStorageSync('flagDialog', 'close');
    },
    backAddGoods: function () { //返回加菜
        if (this.data.from == 'list') {
            wx.redirectTo({
                url: '/pages/carte/carte?tablesid=' + this.data.tablesid + '&storeid=' + app.shopId
            })
        } else {
            wx.navigateBack({
                delta: 1
            })
        }
    },
    pullUpSuc: function () { //上拉成功    
        var animation = wx.createAnimation({
            duration: 1000,
            timingFunction: "ease",
            delay: 0
        })
        this.animation = animation
        animation.translateY(0).step();
        app.isSuccess = 0;
        this.setData({
            animationData: animation.export(),
            isSuccess: true,
            isMask: true,
        })
    },
    pullDownSuc: function () {
        var animation = wx.createAnimation({
            duration: 1000,
            timingFunction: "ease",
            delay: 0
        })
        this.animation = animation
        animation.translateY(this.data.wHeight).step();
        this.setData({
            animationData: animation.export(),
            isMask: false,
        })

        setTimeout(function () {
            this.setData({
                isSuccess: false
            })
        }.bind(this), 2000)
    },
    payNow: function () { //点击立即支付 先验证是否支付 1支付弹窗 2没支付跳转至支付页面

        let parmas = {
            'tablesid': this.data.tablesid,
            'orderid': this.data.orderid,
            'needVip': 1,
            'access_token': this.data.access_token
        }

        API.getOrderDetail(parmas).then((res) => {
            if (res.data.data.table_order_pay == 0) {
                wx.navigateTo({
                    url: '/pages/payment/payment?orderid=' + this.data.orderid + '&tablesid=' + this.data.tablesid+'&xz'
                })
            } else{
                var dialog = this.data.dialog;
                dialog.hidden = false;
                dialog.text = '该订单状态已改变';
                this.setData({ dialog, d_type: 'payorder' });
            }
        }, (err) => {

        })
       

    },
    iKown() { //弹窗知道了
        let dialog = this.data.dialog;
        dialog.hidden = true;
        this.setData({ dialog });
        if (this.data.d_type == 'payorder') {
            this.getData();
        } else if (this.data.d_type == 'clean') {
            wx.switchTab({
                url: '/pages/index/index',
            })
        } else if (this.data.d_type == 'cancelorder') {
            wx.switchTab({
                url: '/pages/index/index',
            })
            return
        }
    },
    bindFormSubmit: function (e) {
        var value = e.detail.value.textarea.length
        console.log(value)
        if (value > 144) {
            wx.showToast({
                title: '输入不能超过144个字符',
                icon: 'loading',
                duration: 2000
            })
        } else {
            wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 2000
            })
        }
    },
    //  预览餐桌码
    preview: function () {
        this.setData({ isPrew: true, isScroll: false });
    },
    //  关闭
    closePrew: function () {
        this.setData({ isPrew: false, isScroll: true });
    },
    /**
     * 点击刷新
     */
    refreshData() { //点击刷新
        this.refWait();
        wx.showLoading({ 'title': '数据请求中', 'mask': true })
        this.getData();
    },
    refWait: function () { //刷新动画
        // 旋转
        var that = this
        var animation = wx.createAnimation({
            duration: 2000,
            timingFunction: 'ease',
        })
        animation.rotate(360).step()
        that.setData({
            animationData: animation.export()
        })
        setTimeout(() => {
            animation.rotate(0).step({ duration: 0, transformOrigin: "50%,50%", timingFunction: 'linear' })
            that.setData({
                animationData: animation.export()
            })
        }, 2000)
    },
    /**
     * 联系服务员
     */
    calling() {
        var tel = wx.getStorageSync('tel') || '';
        wx.makePhoneCall({
            phoneNumber: tel,
            success: res => { },
            fail: res => { }
        })
    },
    /**
     * 显示 虚拟支付明细弹窗
     */
    showPayDetailDialog(){
        this.setData({isPayDetailDialog:true})
    },
    /**
     * 关闭 虚拟支付明细弹窗
     */
    closePayDetailDialog(){
        this.setData({ isPayDetailDialog: false })
    }
})
