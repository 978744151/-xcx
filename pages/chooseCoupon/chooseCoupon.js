var app = getApp(),
  API = require('../../utils/api.js'),
  wechat = require('../../utils/wechat.js'),
  utils = require('../../utils/util.js');
Page({
  data: {
    access_token: null,
    isLoading: true,
    showMessage: false,
    messageContent: '',
    //调用系统颜色
    pagecolor: {
      bgcolor: app.currentbg.bgcolor,
      textcolor: app.currentbg.textcolor
    },
    scrollHeight: 0,
    cpage: 0,
    nocoupon: false,
    mode: null,
    ticker: {},
    orderid: null,
    couponList:[]
  },
  onLoad: function (options) {
    console.log(options)
    var access_token = wx.getStorageSync('access_token') || app.access_token,
      ticker = wx.getStorageSync('ticker') || {},
      allPrice = options.allPrice || 0,
      saleMoney = options.saleMoney || 0,
      subMoney = options.subMoney || 0,
      tablesid = options.tablesid || 0,
      couponPrice = options.couponPrice || 0,
      orderid = options.id || 0;
    var couponMoney =  Number((allPrice - saleMoney).toFixed(2));
    this.setData({ access_token, orderid, ticker, couponMoney, subMoney, couponPrice, tablesid})
  },
  onShow: function () {
    this.getData();
    try {
      var res = wx.getSystemInfoSync();
      var scrollHeight = (Number(res.windowHeight) * 750 / res.windowWidth) - 80;
      this.setData({
        scrollHeight: scrollHeight
      })
    } catch (e) { }
  },

  onHide: function () {

  },
  getData() {
    var access_token = this.data.access_token,
      ticker = this.data.ticker,
      couponMoney = this.data.couponMoney,
      subMoney = this.data.subMoney,
      couponPrice = this.data.couponPrice,
      orderid = this.data.orderid;
    if(this.data.tablesid == -2){
      API.getWmcouponList({ access_token, storeid: app.shopId, totalprice: this.data.couponPrice, weid: app.weid })
        .then((res) => {
          console.log(res)
          var msg = res.data.msg,
            data = res.data.data,
            status = res.data.status;
          console.log(msg, data, status)
          if (status != 0) {
            utils.showMessage(this, msg);
            console.log(1)
          } else {
            var _couponList = [...data.validList,...data.invalidList];
            var couponList = [];
            _couponList.map((item) => {
              if (Number(couponPrice) >= item.value && item.card_type == 5) {
                couponList.push(item)
              }
              if (item.card_type == 4) {
                couponList.push(item)
              }
            })
          }
          console.log(couponList)
          this.setData({ data, status, isLoading: false, couponList})
          this.fucCouponIndex();
        }, (err) => {

        })
    }else{
      API.getCouponList({ access_token, orderid, a: 'select', type: 2 })
        .then((res) => {
          let { msg, data, status } = res.data;
          if (!status) {
            utils.showMessage(this, msg);
          } else {
            var _couponList = data.validList;
            console.log(_couponList)
            var couponList = [];
            _couponList.map((item) => {
              if (Number(subMoney) >= item.value && item.card_type == 5) {
                couponList.push(item)
              }
              if (item.card_type == 4) {
                couponList.push(item)
              }
            })
          }
          this.setData({ status, data, isLoading: false, couponList })
          this.fucCouponIndex();
        }, (err) => {

        })
    }
    
  },
  changePage: function (e) {
    var page = e.currentTarget.dataset.page;
    this.setData({
      cpage: page
    })
  },
  viewChange: function (e) {
    var page = e.detail.current;
    this.setData({
      cpage: page
    })
  },
  /**
   * 计算优惠券的下标
   */
  fucCouponIndex() {
    var ticker = this.data.ticker,
      couponList = this.data.couponList,
      orderid = this.data.orderid;
    if (!utils.isEmpty(ticker) && ticker.hasOwnProperty(orderid)) {
      couponList.map((item, index) => {
        
        if (item.id == ticker[orderid].id) {
          console.log(index)
          this.setData({ mode: index });
          return;
        }
      })
    } else {
      this.setData({ mode: null })
    }
  },
  /**
   * 不使用优惠券，清除缓存
   */
  nocoupon: function () {
    this.setData({
      nocoupon: !this.data.nocoupon,
      mode: null
    });
    var ticker = wx.getStorageSync('ticker') || {},
      orderid = this.data.orderid;
    if (ticker.hasOwnProperty(orderid)) {
      delete ticker[orderid]
    }
    this.setData({ ticker })
  },
  /**
   * 选择优惠券，添加缓存
   */
  changPayMode: function (e) {
    var mode = e.currentTarget.dataset.mode,
      couponList = this.data.couponList,
      orderid = this.data.orderid;
    console.log(orderid)
    var ticker = {};

    var tickerJSON = couponList[mode];
    ticker[orderid] = tickerJSON;
    this.setData({ mode, ticker, nocoupon: false })
    // wx.setStorageSync('ticker', ticker);
  },
  /**
   * 选好了，返回
   */
  linkBack() {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length-2],
      ticker = this.data.ticker;
    wx.setStorageSync('ticker', ticker)
    prevPage.setData({ isComeCoupon: true })

    wx.navigateBack({
      delta: 1
    })
  }
})