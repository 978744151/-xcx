var app = getApp(), API = require('../../utils/api.js'), wechat = require('../../utils/wechat.js'), utils = require('../../utils/util.js');
Page({
  data: {
    isLoad: true,
    validList: [],     //优惠券列表
    validCount: 0,     //可用优惠券总条数
    showMessage:false, //msg提示Boolean
    isVip:''
  },

  //页面加载
  onLoad: function (options) {
    API.setNavTtitle('优惠券');
    console.log(options.isVip)
    this.setData({
      isVip: options.isVip
      
    })
  },

  onReady: function () { },

  onShow: function () {
    this.getData();
  },
  // 上拉加载
  onReachBottom: function () {
    // this.getData();
  
    // var page = this.data.page;
    // if (!this.data.isEnd) {
    //   page = Number(page) + 1;
    //   this.setData({ page, isMore: false })
    //   this.getData();
    // }
  },
  getData() {
      var access_token = wx.getStorageSync('access_token'), page = this.data.page;
      API.getCouponList({ access_token, a: 'self'  }).then((res) => {
        console.log(res.data.data)
        let { validList, validCount } = res.data.data;
        this.setData({ validList, validCount, isLoad:false })
      }, (err) => {
      })
   
  },
  //领取红包
  getCoupon(e) {
    if (this.data.isVip != 1) {
      wx.showToast({
        title: '请先开启会员',
      })
      return
    }
    console.log(this.data.validList,e,'e');
    const id = e.currentTarget.dataset.id;
    const ind = e.currentTarget.dataset.index
    var params = [],
      redPackData = this.data.validList;
    var cardId = redPackData[ind].card_id;
    var cardExt = JSON.stringify(redPackData[ind].cardExt);
    params.push({ cardId, cardExt })
    this.wechatAddCard(params, id);
    console.log(params, 'ttt111')
  },
  /**
   * 调用微信领取接口
   */
  wechatAddCard(params, id) {
    var reList = this.data.reList;
    wechat.addCard(params).then((res) => {
      console.log('卡券', res);
      reList[id] = 1;
      this.setData({ reList, isRe: true })
      var code = res.cardList[0].code,
        access_token = this.data.access_token,
        card_id = res.cardList[0].cardId;
      // console.log(res);
      API.getAddCouponNotice({ code, card_id, access_token }).then((res) => {

        this.onShow();
        app.showToast('领取优惠券成功', 'success')
        console.log(res)
      }, (err) => {
        console.log(err)
      })
    }, (err) => {
      // utils.showMessage(this, err.errMsg);
      console.log(err);
    })
  },

  onHide: function () { },


  onPullDownRefresh: function () {
    // this.setData({ page: 1, isEnd: false });
    this.getData();
    wx.stopPullDownRefresh();
  },


})