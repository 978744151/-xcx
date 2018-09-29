var app = getApp(),
    API = require('../../utils/api.js'),
    isPay = false,
    utils = require('../../utils/util.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isScroll:true,
        pagecolor:app.currentbg,
        num: '',
        access_token: null,
        dialog: {
            isHidden: true,
            title: '其他金额',
            isInput: false,
            inputVal: '',
            txt: [''],
            cancelText: '取消',
            confirmText: '立即充值',
        },
        
        money: null, //充值金额
        type:null,//充值类型
        point:null,
        aPoint:0,
        type:null,
        showMessage: false,
        messageContent: '',
        isLoading: true,
        scrollHeight: null,
        isVipRuleHidde: true,
        moneynum: null,
        openDialog: {
            isPowerHidden: true,
            powerDialogTip: '充值功能暂未开放,晚点再来吧',
            powerBtnColor: app.currentbg.linecolor
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var access_token = app.access_token || wx.getStorageSync('access_token'),
            res = wx.getSystemInfoSync(),
            scrollHeight = (Number(res.windowHeight) * 750 / res.windowWidth) - 190 * 2;
        this.setData({ access_token, scrollHeight });
    },
    clickmoney: function (e) {
        var moneynum = e.currentTarget.dataset.index;
        var money = e.currentTarget.dataset.money,
            point = e.currentTarget.dataset.point,
            aPoint = Number(money)  + Number(point) ,
            type = e.currentTarget.dataset.type;

        if (moneynum != this.data.moneynum) {
            this.setData({
                moneynum,
                money,
                type,
                point,
                aPoint
            })
        } else {
            this.setData({
                moneynum: null,
                money: null,
                type:null,
                point:null,
                aPoint:0
            })
        }

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
        this.getData();
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
        this.getData();
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
        wx.showShareMenu({
            withShareTicket: true
        })
        var that = this;
        return {
            title: '充值',
            path: '/pages/balance/balance',
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
            app.checkSession((parmas) => {
                this.setData({ access_token: parmas.access_token })
                this.getPayData(parmas)
            })
        }
    },
    getPayData(parmas) {
        API.getPaymentCode(parmas).then((res) => {
            let infoData = res.data.data;
            if (infoData.isopen == 0) {
                this.showPowerDialog();
                this.setData({ isLoading: false, infoData})
            }else{
                this.setData({ infoData, num: infoData.money, isLoading: false });
            }  
            wx.stopPullDownRefresh() //停止下拉刷新
        }, (err) => {
            this.setData({ isLoading: false });
            wx.stopPullDownRefresh() //停止下拉刷新
        })
    },
    /**
     * 充值对话框
     */
    showconfirm(e) {
        var money = this.data.money,
            dialog = this.data.dialog;
        // dialog.isHidden = false;
        // dialog.txt = [`确认充值${money}元`];
        // this.setData({ money, dialog })
        // 
        // this.setData({ money });
        // var money = this.data.money;
        var params = {};
        params.money = money;
        params.access_token = this.data.access_token;
        params.type = this.data.type;
        params.credit = this.data.point;
        if (money > 0) {
            this.sendPay(params);
        } else {
            utils.showMessage(this, '请选择充值金额');
        }

    },
    /**
     * 输入的对话框
     */
    showconfirmInput() {
        var dialog = this.data.dialog;
        dialog.isHidden = false;
        dialog.isInput = true;
        this.setData({ money: 0, dialog, moneynum: null,type:3,isScroll:false })
    },
    /**
     * 关闭对话框
     */
    dialogCancel(type) {
        console.log(this.data.type)
        if(type != 'cancel'){
           
            var dialog = this.data.dialog;
            dialog.title = '其他金额'
            dialog.isHidden = true;
            dialog.inputVal = '';
            dialog.isInput = false;
            // dialog.inputVal = '';
            // this.setData({ dialog, money: 0 });
            this.setData({ dialog,isScroll:true});
        }
       
    },
    /**
     * 输入框
     */
    bindInput(e) {
        var dialog = this.data.dialog;
        dialog.inputVal = e.detail.value;
        this.setData({ money: e.detail.value, dialog });
    },
    /**
     * 点击确认
     */
    dialogSuccess() {
        var money = this.data.money,
            dialog = this.data.dialog,
            access_token = this.data.access_token;
        dialog.isHidden = true;

        if (!dialog.cancelText) {
            dialog.title = '充值成功'
            dialog.cancelText = '取消';
            dialog.confirmText = '确认';
            dialog.txt = [''];
            this.setData({ dialog,moneynum: null });
            this.onShow();
        }

        if (money > 0) {
            if (dialog.isInput) {
                if (money > 9999) {
                    utils.showMessage(this, '请输入小于9999充值金额');
                    return;
                }
            }
            this.setData({ dialog });
            this.sendPay({ money, access_token })
        } else {
            if (dialog.isInput) {
                console.log(dialog.inputVal <= 0)
                if (dialog.inputVal <= 0) {
                    this.dialogCancel();
                    utils.showMessage(this, '请输入充值金额');
                }
            } else {
                this.setData({ dialog, money: 0 });
            }
        }

    },
    /**
     * 发送充值请求
     */
    sendPay(params) {
        if (!isPay) {
            isPay = true;
            API.sendRecharge(params).then((res) => {
                if (res.data.data.status) {
                    this.wechatPay(res.data.data.msg);
                } else {
                    isPay = false;
                    if (res.data.data.code == -1) {
                        this.showPowerDialog();
                    } else {
                        this.dialogCancel();
                        utils.showMessage(this, res.data.msg);
                    }
                    //
                }
            }, (err) => {
                isPay = false;
                utils.showMessage(this, '请求数据错误');
            })
        }

    },
    /**
     *打开  没有开放弹窗
     */
    showPowerDialog() {
        let openDialog = this.data.openDialog;
        openDialog.isPowerHidden = false;
        this.setData({ openDialog })
    },
    /**
    * 关闭 没有开放弹窗
    */
    backPage() {
        let openDialog = this.data.openDialog;
        openDialog.isPowerHidden = true;
        this.setData({ openDialog });
        wx.navigateBack({
            delta: 1
        })
    },
    /**
     * 调用微信支付
     */
    wechatPay(params) {
        var dialog = this.data.dialog,
            money = this.data.money,
            num = this.data.num;
        num = Number(Number(num) + Number(money)).toFixed(2);
        API.fetPay(params).then((res) => {
            dialog.txt = [`恭喜您成功充值 ${money} 元`, `最新余额为 ${num} 元`];
            dialog.cancelText = '';
            dialog.inputVal = '';
            dialog.confirmText = '知道了';
            dialog.isInput = false;
            dialog.isHidden = false;
            this.setData({ dialog, num, money: 0 });

            var _params= {}
            _params.orderid= params.orderid;
            _params.access_token = this.data.access_token
            // API.depostCallback(_params).then((res)=>{
            //     console.log(res)
            // },(err)=>{
            //     console.log(err)
            // })
            app.isPay = true;
            isPay = false;
        }, (err) => {
            isPay = false;
            this.dialogCancel('cancel');
            utils.showMessage(this, '已取消支付');
        })
    },
    showRule() {
        wx.setNavigationBarTitle({ title: '撒椒VIP储值卡协议' })
        this.setData({ isVipRuleHidde: false })
    },
    closeRule() {
        wx.setNavigationBarTitle({ title: '我的余额' })
        this.setData({ isVipRuleHidde: true })
    },
    calling: function () {
        wx.makePhoneCall({
            phoneNumber: '0755-29303844' //此号码并非真实电话号码，仅用于测试
        })
    },
})