let app = getApp();
var API = require('../../utils/api.js');
Page({

  data: {
    status:null,
    orderList:[],
    clock: '',
    isDetail:false,
    tablesid:'',
    disabled:true,
  },

  onLoad: function (options) {
    console.log(options)
    var phone = wx.getStorageSync('storetel');
    this.setData({ orderid: options.orderid, tablesid: options.tablesid });
      this.orderDetails(options);
      count_down(this);
     
     
  },
  //点击虚拟支付
  showDialog:function(){
    this.setData({ isDetail: true})
  },
  //知道了
  paySure:function(){
    this.setData({
      isDetail: false
    })
  },
  onReady: function () { },

  onShow: function () {
    wx.removeStorageSync('ticker')
   },

  onHide: function () { },

  onUnload: function () { },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  },

    //订单详情
    orderDetails(options){
        let access_token = wx.getStorageSync('access_token'),
            orderid = options.orderid,
            // tablesid = -2,
            parmas = { 'orderid': orderid, 'tablesid': this.data.tablesid, 'access_token': access_token };
        API.getOrderDetail(parmas).then((res) => {
            wx.hideLoading()
            console.log(res,'isYang')
            var list = res.data.data,
                times = list.time,
                is_pay = list.table_order_pay;
            var jianGeTimes = getDate(times)
            var totalprice = Number(list.totalprice) + Number(list.packvalue) + Number(list.cutlery_money)
            list = this.data.orderList.length > 0 && nowPage != 1 ? this.data.orderList.concat(list) : list;
          console.log(list)
            this.setData({
                isLoading: false,
                status: list.status,
                orderList: list,
                totalprice,
                jianGeTimes,
                is_pay
            });
          
        }, (err) => {
            wx.hideLoading()
            console.log(`请求订单详情页失败${err}`);
            this.setData({
                isLoading: false
            })
        })
    },

    //自提订单状态修改
    sureQC(e){
      wx.showModal({
        title: '提示',
        content: '确认取消订单吗',
        success:  (res)=> {
          if (res.confirm) {
            let access_token = wx.getStorageSync('access_token'),
              orderid = this.data.orderid,
              status = e.currentTarget.dataset.id,
              parmas = { 'status': status, 'orderid': orderid, 'access_token': access_token };
            API.getZtOrderDetail(parmas).then((res) => {
              wx.hideLoading()
              var list = res.data.data;
              list = this.data.orderList.length > 0 && nowPage != 1 ? this.data.orderList.concat(list) : list;
              this.setData({
                isLoading: false,
                status: list.status,
                orderList: list,
              });


            }, (err) => {
              wx.hideLoading()
              console.log(`请求订单详情页失败${err}`);
              this.setData({
                isLoading: false
              })
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    gopay(){
      if(this.data.tablesid == -2){
        var shopInfo = {
          'myCart': this.data.orderList.list,
          'total_price': Number(this.data.orderList.totalprice) + Number(this.data.orderList.cutlery_money),
          'packvalue': Number(this.data.orderList.cutlery_money),
          'total_dish_count': Number(this.data.orderList.totalnum)
        }
        wx.setStorageSync('shopInfo', shopInfo);
        wx.navigateTo({
          url: '/pages/createOrder_out/createOrder_out?orderid=' + this.data.orderid + '&tablesid=-2'
        })
      } else if (this.data.tablesid == -1){
        wx.navigateTo({
          url: '/pages/payment/payment?orderid=' + this.data.orderid + '&tablesid=-1'
        })
      }
    },

    //联系商家
    tel(e){
        wx.makePhoneCall({
            phoneNumber: wx.getStorageSync('tel'),
        })
    },

    //再来一单跳转
    onemore(){
      if(this.data.tablesid == -1){
        wx.navigateTo({
          url: '/pages/orderCarte/orderCarte?tablesid=-1',
        })
      } else if (this.data.tablesid == -2){
        wx.navigateTo({
          url: '/pages/outFood/outFood?tablesid=-2',
        })
      }
       
    },


})


// 定义一个总毫秒数，以一分钟为例。TODO，传入一个时间点，转换成总毫秒数

// var total_micro_second = 900000;

/* 毫秒级倒计时 */
function count_down(that) {
    // 渲染倒计时时钟
    that.setData({
      clock: date_format(that.data.jianGeTimes)
    });

  if (that.data.jianGeTimes <= 0) {
        that.setData({
            clock: "已经截止",
            disabled:false
        });
        // timeout则跳出递归
        return;
    }
    setTimeout(function () {
        // 放在最后--
      that.data.jianGeTimes -= 10;
        count_down(that);
    }, 10)
}

// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
    // 秒数
    var second = Math.floor(micro_second / 1000);
    // 小时位
    var hr = Math.floor(second / 3600);
    // 分钟位
    var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
    // 秒位
    var sec = fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
    // 毫秒位，保留2位
    var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));

    return '(还剩' + min + "分" + sec + '秒)';
}

// 位数不足补零
function fill_zero_prefix(num) {
    return num < 10 ? "0" + num : num
}
// 时间戳计算
function getDate(times) {
  var date = new Date(times),
  times = Date.parse(date),//15分后的时间
  nowTimes = Date.parse(new Date()), //当前时间
  jianGeTimes = times - nowTimes;//间隔时间
  return jianGeTimes
}