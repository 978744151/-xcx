// pages/pay/pay.js
var app = getApp(),
    utils = require('../../utils/util'),
    wechat = require('../../utils/wechat'),
    API = require('../../utils/api.js');

var time = null;

Page({
    /**
     * 页面的初始数据
     */
    data: {
        isLoadIndex: true,   //首页加载动画Boolean
        data: {},            //首页数据
        title: '',           //店铺名称
        saletitle: '',       //折扣金额抬头
        // salenum: '',         //折扣金额
        isPullDialog: true,  //弹窗显示Boolean
        selected: null,      //选择优惠券
        tempSelected: null,  //temp优惠券下标值
        isRemark: false,     //备注Boolean
        focusRemark: false,   //备注获取焦点Boolean
        allPrice: '',         //总价
        realPrice: '0.00',      //实际支付价格
        remark: '',             //备注
        access_token: null,
        salePrice: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const access_token = wx.getStorageSync('access_token');
        if(!access_token){
            wx.navigateTo({
                url: '/pages/setting/setting?type=fast',
            })
        }
        this.setData({ access_token })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () { },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        clearTimeout(time)
        this.setData({ remark: '', unSalePrice: '', realPrice: '0.00', allPrice: '', salePrice: '', isRemark: false, selected: null })
        this.getData();
    },
    /**
     * 获取数据
     */
    getData() {
        const access_token = this.data.access_token,
         isVip = wx.getStorageSync('userinfo').isVip
        API.getFastBuy({ access_token }).then((res) => {
            if (!res.data.status) {
                utils.showMessage(this, res.data.msg);
            }
            const { data, title } = res.data.data;
            let saletitle = '', selected = null, tempSelected = null;
            if (data.length > 0) {
                saletitle = data[0].describe;
                selected = 0;
                tempSelected = 0;
            }
            this.setData({ data, title, saletitle, selected, tempSelected, isLoadIndex: false, isVip})
        }, (err) => {
            this.setData({ isLoadIndex: false })
            console.log(err);
        })
    },
    /**
     * 上拉展示优惠券
     */
    showCoupon() {
        this.setData({
            isPullDialog: false,
            tempSelected: this.data.selected
        })
    },
    //关闭页面
    closeCoupon() {
        this.setData({
            isPullDialog: true,
        });
    },
    /**
     *选择优惠券 
     */
    radioChange(e) { //radioChange事件
        var listCoupon = this.data.data;
        if (listCoupon.length == 0) {
            return;
        }
        var selected = e.currentTarget.dataset.selected;

        if (selected == -1) { //点击本身取消选中
            this.setData({ tempSelected: -1 })
        } else {
            this.setData({ tempSelected: selected })
        }
    },
    /**
     * 确认优惠券
     */
    confrimCoupon() {
        const listCoupon = this.data.data,
            tempSelected = this.data.tempSelected;
        console.log(listCoupon)
        let selected = tempSelected,
            saletitle = tempSelected == -1 ? '商家优惠券' : listCoupon[selected].describe;
        this.setData({ selected, saletitle })
        this.closeCoupon();
        this.funcRealPrice();
    },
    /**
     * 显示优惠券
     */
    tapRemark() {
        this.setData({ isRemark: true, focusRemark: true })
    },
    /**
     *输入总价 
     */
    inputAllPrice(e) {
        let tempPrice = Number(e.detail.value),
            unSalePrice = this.data.unSalePrice || '';
        let allPrice = '';
        if (tempPrice >= 0) {
            if (tempPrice.toString().indexOf('.') > -1) {
                allPrice = Number((Number(tempPrice)).toFixed(2));
                unSalePrice = allPrice >= unSalePrice ? unSalePrice : allPrice;
            } else {
                allPrice = tempPrice > 0 ? tempPrice : '';
                unSalePrice = allPrice >= unSalePrice ? unSalePrice : allPrice;
            }
        }
        this.setData({ allPrice, unSalePrice })
        this.funcRealPrice();
    },
    /**
     * 输入不参加优惠金额
     */
    inputUnSalePrice(e) {
        let allPrice = Number(this.data.allPrice),
            tempPrice = Number(e.detail.value);
        let unSalePrice = '';
        console.log(allPrice, tempPrice)
        if (tempPrice > 0) {
            if (allPrice >= tempPrice && allPrice > 0) {
                if (tempPrice.toString().indexOf('.') > -1) {
                    unSalePrice = utils.myToFixed(tempPrice)
                } else {
                    unSalePrice = tempPrice
                }
            } else {
                unSalePrice = allPrice > 0 ? allPrice : '';
                allPrice = allPrice > 0 ? allPrice : '';
            }
        }
        this.setData({ unSalePrice, allPrice })
        this.funcRealPrice();
    },
    /**
     * 实际支付金额
     */
    funcRealPrice() {
        let allPrice = this.data.allPrice,              //订单金额
            unSalePrice = this.data.unSalePrice || 0,   //不参与优惠的金额
            listCoupon = this.data.data,              //折扣券列表
            selected = this.data.selected,             //选择折扣券
            selectedItem = listCoupon[selected];       //选择优惠券info id
        let salePrice = '', realPrice = '';
        clearTimeout(time);
        selected = selected == null ? -1 : selected;
        time = setTimeout(() => {
            if (selected == -1) {
                realPrice = utils.myToFixed(allPrice);
            } else {
                if (allPrice > 0) {
                    var tempSale = allPrice - unSalePrice;
                    var tempDis = (10 - selectedItem.discount) / 10;
                    var sDis = selectedItem.discount / 10;
                    salePrice = tempSale * tempDis >= 0.01 ? utils.myToFixed(tempSale * tempDis) : 0;
                    if (selectedItem.money >= salePrice) {
                        // realPrice = salePrice > 0 ? (allPrice - salePrice).toFixed(2) : allPrice;
                        realPrice = getPayMoney(allPrice, unSalePrice, sDis)
                        console.log(realPrice)
                        salePrice = (allPrice - realPrice).toFixed(2)
                    } else {
                        salePrice = Number(selectedItem.money) >= salePrice ? salePrice : selectedItem.money;
                        realPrice = utils.myToFixed(allPrice - salePrice);
                    }
                } else {
                    realPrice = '0.00';
                }

            }

            this.setData({ realPrice, salePrice })
        }, 1000);
        this.setData({ salePrice: '计算中...', realPrice: '--' })
        // this.setData({})
    },
    /**
     * 点击支付按钮
     */
    tapPayBtn() {
        var inmoney = this.data.allPrice, //订单金额
            outmoney = this.data.unSalePrice,
            paymoney = this.data.realPrice,
            remark = !!this.data.remark ? this.data.remark : '';
        var listCoupon = this.data.data,
            access_token = this.data.access_token;

        console.log(listCoupon);
        if (listCoupon.length > 0) {
            var selected = this.data.selected,
                aid = selected >= 0 ? listCoupon[selected].id : '';
        }
        else {
            aid = '';
        }


        if (isNaN(paymoney) || !paymoney > 0) {
            utils.showMessage(this, '请稍后...');
            return;
        }
        if (inmoney > 0) {
            API.getFastBuyPay({ inmoney, outmoney, paymoney, remark, aid, access_token })
                .then((res) => {
                    if (res.data.status) {
                        this.wechatPay(res.data.data);
                    } else {
                        utils.showMessage(this, res.data.msg);
                    }
                }, (err) => {
                    console.log(err)
                })
        } else {
            utils.showMessage(this, '请输入订单金额');
        }
    },
    /**
     * 调取微信支付
     */
    wechatPay(data) {
      wx.showLoading({
        title: '唤起支付...',
        mask: true
      })
        API.fetPay(data).then((res) => {
            app.showToast('支付成功', 'success');
            this.onShow();
        }, (err) => {
            if (err.errMsg == 'requestPayment:fail cancel') {
                utils.showMessage(this, '取消支付');
            } else {
                utils.showMessage(this, err.errMsg)
            }
            console.log(err);
        })
    },
    /**
     * 
     */
    inputRemark(e) {
        const remark = e.detail.value;
        this.setData({ remark })
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () { },
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
    onShareAppMessage: function () { },

})


function getPayMoney(a, b, c) {

    if (a <= b) {
        return a;
    }
    a = (a - b).toFixed(2);
    a = parseInt(a * 10000);
    c = parseInt(a * (1 - c));
    var d = a - c;


    return (Math.max(0.01, (d / 10000).toFixed(2)) + b).toFixed(2);
}