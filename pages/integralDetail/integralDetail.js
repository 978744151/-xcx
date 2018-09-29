// pages/integralList/integralList.js;
var app = getApp(),
    utils = require('../../utils/util.js'),
    API = require('../../utils/api.js');

Page({
    data: {
        color:app.currentbg,
        isIndexLoad: true,
        id: '',
        access_token: null,
        items: {}, //商品信息
        address: [],
        status: null,
        msg: '', //btn 按钮字
        dialogInfo: {
            isShow: true,
            title: '',
            content: '请按提示使用',
            cancelText: '取消',
            confirmText: '确认'
        },
        showMessage: false,
        messageContent: '',
        shoptel: '',
        tid: null, //支付tid
        isCodebg:false,
        istemp: 'intergralbg',
        tradeId: 0
    },
    onLoad(options) {
        var id = options.id || '',
            shoptel = wx.getStorageSync('shoptel'),
            access_token = app.access_token || wx.getStorageSync('access_token');
        this.setData({ id, access_token, shoptel })
    },
    onShow() {
        this.getData();
    },
    onPullDownRefresh() {
        this.getData();
    },
    getData() {
        var parmas = { access_token: this.data.access_token, creditid: this.data.id };
        if (app.modeInfo.is_score == 0) {
            this.setData({ isIndexLoad: false, isCodebg : true});
            return;
        }
        API.getIgGoods(parmas).then((res) => {
            var data = res.data.data;

            if(data.tradeId)
            {
                this.setData({tradeId:data.tradeId});
                // wx.redirectTo({
                //     url: `/pages/itgexchange/itgexchange?id=${data.tradeId}`
                // })
                // return;
            }
            let { items, address, status, msg } = data;
            this.setData({ items, address, status, msg, isIndexLoad: false });
            wx.stopPullDownRefresh() //停止下拉刷新
        }, (err) => {
            this.setData({ isIndexLoad: false });
            console.error(err);
            app.showToast('请求数据错误')
            wx.stopPullDownRefresh() //停止下拉刷新
        })
    },
    exchange() { //点击兑换 按钮
        if (!this.data.status) {
            return false;
        }
        const address = this.data.address,
            type = this.data.items.type;
        console.log(!address.hasOwnProperty('id') && type == 3)
        if (!address.hasOwnProperty('id') && type == 3) {
            utils.showMessage(this, '请添加收货地址');
            return;
        }
        this.data.items.credit = this.data.items.credit
        var dialogInfo = this.data.dialogInfo,
            str = '';
        dialogInfo.isShow = false;
        if (this.data.items.creditmoney <= 0 && this.data.items.postfee <= 0 && this.data.items.credit <= 0) {
            str = `确认免费领取？`;
        } else {
            if (this.data.items.creditmoney <= 0 && this.data.items.postfee <= 0 && this.data.items.credit > 0) {
                str = `确定使用${this.data.items.credit}积分兑换？`;
            } else if (this.data.items.creditmoney <= 0 && this.data.items.postfee > 0 && this.data.items.credit > 0) {
                str = `确定使用${this.data.items.credit}积分+${this.data.items.postfee}运费兑换？`;
            } else if (this.data.items.creditmoney > 0 && this.data.items.postfee <= 0 && this.data.items.credit <= 0) {
                str = `确定使用${this.data.items.creditmoney}人民币兑换？`;
            } else if (this.data.items.creditmoney > 0 && this.data.items.postfee > 0 && this.data.items.credit <= 0) {
                str = `确定使用${(Number(this.data.items.creditmoney)+Number(this.data.items.postfee)).toFixed(2)}人民币(含${this.data.items.postfee}运费)兑换？`;
            } else if (this.data.items.creditmoney > 0 && this.data.items.postfee <= 0 && this.data.items.credit > 0) {
                str = `确定使用${this.data.items.credit}积分+${this.data.items.creditmoney}元兑换？`;
            } else {
                str = `确定使用${this.data.items.credit}积分+${(Number(this.data.items.creditmoney)+Number(this.data.items.postfee)).toFixed(2)}元(含${this.data.items.postfee}运费)兑换？`;
            }
        }
        dialogInfo.title = str;
        this.setData({ dialogInfo })
    },
    dialogCancel() { //点击取消兑换弹窗
        var dialogInfo = this.data.dialogInfo;
        dialogInfo.isShow = true;
        this.setData({ dialogInfo })
    },
    dialogSuccess() { //点击确认兑换弹窗请求
        var dialogInfo = this.data.dialogInfo;
        dialogInfo.isShow = true;
        this.setData({ dialogInfo })
        const parmas = { access_token: this.data.access_token, creditid: this.data.id, addressid: this.data.address.id };
        API.getExchangeGoods(parmas).then((res) => {
            var data = res.data;
            this.setData({ tid: data.data.tid });
            if (data.status) {
                if (data.data.needpay) { //是否需要支付
                    this.wechatPay(data.data.pay);
                } else {
                    app.showToast('兑换成功', 'success');
                    wx.redirectTo({
                        url: `/pages/itgexchange/itgexchange?id=${data.data.tid}`
                    })
                }

            } else {
                utils.showMessage(this, data.msg);
            }
        }, (err) => {
            console.error(err);
            utils.showMessage(this, '请求数据错误');
        })
    },
    wechatPay(parmas) { //调用微信支付
        API.fetPay(parmas).then((res) => {
            app.showToast('兑换成功', 'success');
            wx.redirectTo({
                url: `/pages/itgexchange/itgexchange?id=${this.data.tid}`
            })
        }, (err) => {
            console.log(err);
            this.cancelPay();
            // utils.showMessage(this, '已取消支付');
        })
    },
    cancelPay() { //取消支付
        const parmas = { tid: this.data.tid, access_token: this.data.access_token };
        API.cancelExchange(parmas).then((res) => {
            if (res.data.status) {
                utils.showMessage(this, '已取消支付');
            } else {
                utils.showMessage(this, res.data.data.msg);
            }
        }, (err) => {
            utils.showMessage(this, '取消兑换出错,请联系管理员');
            console.error(err);
        })
    },
    reback: function(){
        wx.navigateBack({delta: 1})
    }

})
