var app = getApp(),
  utils = require('../../utils/util.js'),
  API = require('../../utils/api.js');
var code = null;
Page({
  data: {
    //调用系统颜色
    pagecolor: {
      bgcolor: '#f14949',
      textcolor: app.currentbg.textcolor
    },
    istabCoupon: null,
    hidden: false,
    isTitle: true,
    access_token: null,
    tablesid: null,
    orderid: '',
    orderInfo: {}, //订单详情
    dummyNum: '', //虚拟桌号
    tempGoodsList: [], // 商品列表
    isShowMore: true,
    isToggle: false, //是否展示更多
    toggleTxt: '查看更多',
    isLoading: true,
    isSuccess: false,    //支付成功弹窗Boolean
    orderItems: {}, //支付成功信息数据
    paysale: '10',//优惠券
    scorecheck: true, //积分抵扣开启按钮
    saledia: false,//打开折扣弹窗
    showMessage: false, //提示
    messageContent: '', //提示文字
    switchChecked: true,
    payMoney: 0, //支付金额
    isBalancePayment: false,
    saleMoney: 0,
    d_type: '',
    detailURI: '',
    mobile: '',
    dialog: {
      title: '',
      color: app.currentbg.bgcolor,
      text: '购物车已被同桌删除',
      textAlign: 'left',
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
    uid: null,
    saleDialog: {
      color: app.currentbg.bgcolor,
      items: {}
    },
    successData: {},
    cardstatue: null,
    isCheckPoint: false,
    pointsNum: 0,
    remainMoney: 0,
    _remainMoney: 0,
    _pointMoney: 0,
    pointMoney: 0,
    noticeMsgNomal: "",
    noticeMsgWarring: '',
    couponMoney: '',            //选中优惠券金额
    couponMsg: '',              //选中优惠券提示文字
    isComeCoupon: false,        //Boolean优惠券页面回来
    coupon_record_id: null,     //优惠券微信id
    card_id: null,              //优惠券主键id
    sendPoints: 0,               //送积分
    isShowOtherPayDialog: false,  //其他支付弹窗
    subMoney: 0,                   //减去折扣后的金额
    orderCarte: true,//是否自提详情
    wkIdx: 0,//自提时间左侧index
    showTime: false,//控制时间弹窗mask

    ztTime: '',
    isTime: false, //选择时间
    pickerTimeList: [], //总时间数据
    pickerTimeIndex: 0, //选择时间对应下标
    pickerTimeRight: [], //选择下标对应时间列表
    pickerTimeRightIndex: null, //时间列表选中下标
  },
  onLoad: function (options) {
    var tablesid = options.tablesid || wx.getStorageSync('tablesid'),
      uid = wx.getStorageSync('uid') || '',
      access_token = app.access_token || wx.getStorageSync('access_token'),
      orderid = options.orderid || wx.getStorageSync('orderid'),
      fontColor,
      bgColor,
      xz = options.xz || '',
      xb = options.xb || '',
      navBarTitle = '';

    if (!xz) {
      fontColor = '#ffffff';
      bgColor = '#f14949';
      navBarTitle = '取餐时间';
    } else {
      fontColor = '#000000';
      bgColor = '#ffffff';
      navBarTitle = '向商家付款';
    }
    this.setData({
      xz,
      xb
    });
    wx.setNavigationBarColor({
      frontColor: fontColor,
      backgroundColor: bgColor,
    })
    wx.setNavigationBarTitle({ title: navBarTitle, })
    this.setData({
      tablesid: tablesid,
      orderid: orderid,
      access_token: access_token,
      uid,
    })

  },
  onShow: function () {
    wx.login({
      success: function (res) {
        code = encodeURIComponent(res.code);
      }
    });
    this.userinfo()
    // this.getSyncData();
    this.setData({ pointMoney: 0, remainMoney: 0, isCheckPoint: false, isBalancePayment: false })
    this.getData();

  },
  onPullDownRefresh() {
    this.onShow();
    this.funcPayMoney();
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  userinfo() {
    var userinfo = wx.getStorageSync('userinfo')
    this.setData({
      isVip: userinfo.isVip,
      money: userinfo.money,
      unicom: userinfo.unicom
    })
  },
  closeCoupon() {
    console.log(1)
    this.setData({
      unicom: 1,
      money: 0
    })
  },
  //是否开始积分抵扣
  scorecheck: function () {
    this.setData({ scorecheck: !this.data.scorecheck })
  },
  salehint: function () {
    this.setData({ saledia: !this.data.saledia })
  },
  switch2Change: function (e) { //是否使用会员折扣
    var orderInfo = this.data.orderInfo;
    var payMoney = e.detail.value ? Number(Number(orderInfo.totalprice) - Number(orderInfo.totalprice * this.data.mem_discount)).toFixed(2) : orderInfo.totalprice;
    // console.log(payMoney)
    this.setData({ switchChecked: e.detail.value, payMoney })
  },
  getData: function () {
    let packvalue = wx.getStorageSync('packvalue') || 0,
      is_show = wx.getStorageSync('is_show'),
      trueTime = wx.getStorageSync('trueTime') || 0;
    let parmas = {
      'tablesid': this.data.tablesid,
      'orderid': this.data.orderid,
      'needVip': 1,
      'access_token': this.data.access_token
    }

    API.getOrderDetail(parmas).then((res) => {
      console.log(res, 'rea')
      var cutlery_money = res.data.data.cutlery_money || 0;
      this.setData({
        pickerTimeList: res.data.data.day,
        pickerTimeRight: res.data.data.day[this.data.pickerTimeIndex]['time_list'],
        ztTime: trueTime || '',
        cutlery_money,
        trueTime
      })

      var result = res.data.data,
        saleDialog = this.data.saleDialog;
      var totalprice;
      if (this.data.tablesid < 0) {
        totalprice = Number(res.data.data.allPrice) + Number(packvalue)
      } else {
        totalprice = Number(res.data.data.allPrice) + Number(cutlery_money)
      }
      // console.log(cutlery_money)
      // console.log(totalprice)
      result.items = result.list;
      const { msg } = result.memberInfo;
      saleDialog.items = msg;

      var mem_discount = !!result.mem_discount ? (1 - result.mem_discount).toFixed(2) : result.mem_discount;

      if (result.is_vip == 1 && !!result.mem_discount) {
        result.items.map((item) => {
          item.sale_pay = Number(item.price * mem_discount).toFixed(2);
        })
      }

      var _tempGoodsList = result.items.slice(0, 3);
      console.log(_tempGoodsList, '_tempGoodsList')

      this.setData({
        totalprice,
        orderInfo: result,
        dummyNum: result.table_title.split('-')[1],
        tempGoodsList: _tempGoodsList,
        isLoading: false,
        mem_discount,
        mem_discountStr: result.mem_discount * 10,
        cardstatue: result.cardstatue,
        packvalue,
        is_show
      })
      console.log(this.data.orderInfo, 122)
      if (result.table_order_pay != 0) {
        var dialog = this.data.dialog;
        dialog.hidden = false;
        dialog.text = '该订单状态已改变~';
        this.setData({ dialog, d_type: 'payorder' });
      }

      if (result.cardstatue) {
        //会员卡这款金额
        var saleMoney = utils.myToFixed(result.totalprice * mem_discount);
        this.setData({ saleMoney })
      }
      this.funcPayMoney();

      if (result.cardstatue) {
        this.funCoupon();
      }
    }, (err) => {
      console.log(err);
      utils.showMessage(this, '请求接口错误');
      this.setData({ isLoading: false })
    })
  },

  showComfirmDialog(data) {
    if (data.submitorder && this.data.d_type != 'payorder') {
      const tablesid = this.data.tablesid;
      let defaultDialog = this.data.defaultDialog,
        dialog = this.data.dialog;
      dialog.hidden = true;
      defaultDialog.isShow = false;
      defaultDialog.content = '同桌有加菜哦,是否前往订单详情确认?';
      defaultDialog.confirmText = "知道了";
      defaultDialog.cancelText = '';
      const detailURI = `/pages/orderDetail/orderDetail?orderid=${data.orderid}&tablesid=${tablesid}`
      this.setData({
        defaultDialog,
        dialog,
        detailURI,
        submitorder: true,
        flagDialog: 'close'
      })
    }
  },
  iKown() { //弹窗知道了
    let dialog = this.data.dialog;
    dialog.hidden = true;
    this.setData({ dialog });
    if (this.data.d_type == 'payorder') {
      wx.navigateBack({
        delta: 1
      })
    } else if (this.data.d_type == 'clean') {
      wx.switchTab({
        url: '/pages/index/index',
      })
    } else if (this.data.d_type == 'cancelorder') {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
  },
  closeDialog() {
    let defaultDialog = this.data.defaultDialog;
    defaultDialog.isShow = true;
    this.setData({
      defaultDialog
    })
  },
  dialogSuccess() {
    this.closeDialog();
    wx.redirectTo({
      url: detailURI
    })
  },
  dialogCancel() {
    this.closeDialog();
    this.getData();
  },
  /**
   * 判断支付条件 payMoneyd大于零吊起微信支付 || 其他支付弹窗
   */
  sendPayNow() {
    if (this.data.is_show == 0) {
      // wx.showModal({
      //   title: '提示',
      //   content: '本店已打烊',
      // })
      var dialog = this.data.dialog;
      dialog.hidden = false;
      dialog.text = '本店暂停营业! 如有不便敬请谅解';
      this.setData({ dialog });
      return
    }
    if (this.data.ztTime == '' && this.data.tablesid == -1) {
      wx.showToast({
        title: '请确认选择取餐时间',
        icon: "none"
      })
      return
    }
    if (!this.data.xz) {
      if (!(/^1\d{10}$/.test(this.data.mobile))) {
        wx.showModal({
          title: '提示',
          content: '请输入正确的自提手机号',
          showCancel: false
        })
        return
      }
    }
    var payMoney = this.data.payMoney;
    var showMsg = this.data.payMoney > 0 ? '唤起支付中' : '订单提交中';
    wx.showLoading({ title: showMsg, mask: true })
    if (payMoney > 0) {
      this.payNow()
    } else {
      this.showOtherPayDialog()
    }


  },
  /**
   * 其他支付弹窗
   */
  showOtherPayDialog() {
    setTimeout(() => {
      wx.hideLoading();
      this.setData({ isShowOtherPayDialog: true })
    }, 1000);
  },
  /**
   * 
   */
  closeOtherPayDialog() {
    this.setData({ isShowOtherPayDialog: false })
  },
  /**
   * 点击其他支付弹窗 确认按钮
   */
  tapOtherPay() {
    this.closeOtherPayDialog();
    this.payNow();
    wx.showLoading({ title: '虚拟支付中', mask: true })
  },
  /**
   * 立即支付
   */
  payNow: function () { //立即支付
    var that = this,
      tablesid = this.data.tablesid,
      access_token = this.data.access_token,
      orderid = this.data.orderid,
      type = this.data.switchChecked ? 1 : 0, //是否有折扣
      money = this.data.isBalancePayment && this.data.remainMoney > 0 ? this.data.remainMoney : 0, //455.47
      credit = this.data.isCheckPoint && this.data.pointsNum > 0 ? this.data.pointsNum : 0, //41.81
      card_id = this.data.card_id,
      coupon_record_id = this.data.coupon_record_id,
      tel = this.data.mobile,
      parmas1 = {
        meal_time: this.data.ztTime || '',
        orderid,
        tablesid,
        access_token,
        type,
        money,
        credit,
        card_id,
        coupon_record_id,
        tel: tel
      };
    console.log(this.meal_time, 666)
    API.goPayMoney(parmas1).then((res) => {
      console.log(parmas1)
      var data = res.data;
      wx.hideLoading();
      if (data.data == '-89') {
        utils.showMessage(this, '已有人在支付,请稍后...');
        return;
      }

      if (data.code == '-78') {
        utils.showMessage(this, '其他人提交中，请稍后...');
        return;
      }

      if (data.data == '-90') {
        var dialog = this.data.dialog;
        dialog.hidden = false;
        dialog.text = '该订单状态已改变~';
        this.setData({ dialog, d_type: 'payorder' });
        return;
      }


      if (data.status) {
        //无需支付流程 ①积分余额代金券等恰好抵消，则返回支付成功或异常：
        if (data.data.hasOwnProperty('paystatue')) {
          this.otherPay(data, parmas1)
        } else {
          //发起微信支付
          var params2 = {
            'timeStamp': data.data.timeStamp,
            'nonceStr': data.data.nonceStr,
            'package': data.data.package,
            'signType': data.data.signType,
            'paySign': data.data.paySign,
          }
          this.wechatPay(params2, parmas1);
        }
      } else {
        console.log(res);
        utils.showMessage(this, data.msg)
        this.payFail(parmas1);
      }
    }, (err) => {
      this.payFail(parmas1);
      console.log(err);
      utils.showMessage(this, '支付失败')
    })
  },
  cateCoupon() {
    wx.navigateTo({
      url: '/pages/getKingCoup/getKingCoup',
    })
  },
  /**
   * 积分余额代金券等支付
   */
  otherPay(data, parmas) {
    if (data.data.paystatue) {
      this.getSuccessData(); //请求支付成功接口
    } else {
      this.payFail(parmas);
      utils.showMessage(this, data.data.retmsg);
    }
  },
  /**
   * 付款失败，解锁
   */
  payFail: function (parmas) {
    API.lockPayFail(parmas).then((res) => {
      console.log(res);
    }, (err) => {
      this.payFail(parmas);
      console.log(err);
      utils.showMessag(this, '联系柜台付款')
    })
  },
  wechatPay: function (parmas, parmas1) { //弹出微信支付
    API.fetPay(parmas).then((res) => {
      this.getSuccessData(); //请求支付成功接口
      this.payFail(parmas1);
    }, (err) => {
      console.log(err);
      this.payFail(parmas1);
      utils.showMessage(this, '已取消支付')
      // app.showToast('支付失败')
    })
  },
  showMoreGoods: function () { //展示更多列表
    var list = this.data.orderInfo.items,
      goodsList = this.data.isToggle ? list.slice(0, 3) : list,
      toggleTxt = this.data.isToggle ? '查看更多' : '折叠列表';
    this.setData({
      tempGoodsList: goodsList,
      isShowMore: false,
      isToggle: !this.data.isToggle,
      toggleTxt: toggleTxt
    })
  },
  /**
   * 支付成功 回调
   */
  getSuccessData: function () { //获取支付成功数据
    var that = this,
      tablesid = this.data.tablesid,
      access_token = this.data.access_token,
      orderid = this.data.orderid,
      parmas = { 'orderid': orderid, 'tablesid': tablesid, 'access_token': access_token };

    API.getPaySuccessData(parmas).then((res) => {
      this.setData({ successData: res.data.data })
      this.pullUpSuc();
    }, (err) => {
      utils.showMessage(this, '获取支付成功信息失败')
      // app.showToast('获取支付成功信息失败')
    })
  },
  /**
   * 支付成功弹窗
   */
  pullUpSuc: function () { //上拉成功
    this.setData({ isSuccess: true })
  },
  /**
   * 关闭支付成功弹窗
   */
  pullDownSuc: function () {
    this.setData({ isSuccess: false })

  },
  /**
   * 返回首页
   */
  backIndex: function () {
    this.pullDownSuc();
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  /**
   * 使用优惠券
   */
  useSale(e) { //是否使用折扣
    console.log(this.data.tablesid)
    if (this.data.tablesid < 0) {
      var allMoney = this.data.orderInfo.totalprice + this.data.packvalue;                      //总金额
      console.log(allMoney)
    } else {
      var allMoney = this.data.orderInfo.totalprice + this.data.cutlery_money;
      console.log(allMoney)
    }
    var needDiscount = this.data.orderInfo.needDiscount || allMoney;    //参与打折金额    
    var cardstatue = this.data.cardstatue;                              //会员是否可用
    var mem_discount = this.data.mem_discount;                          // 会员折扣
    var vipPayMoney = (needDiscount * mem_discount).toFixed(2);             //会员折扣价格
    var rPayMoney = Number((needDiscount * (1 - mem_discount)).toFixed(2)); //折扣后价格
    var switchChecked = e.detail.value;
    var couponMoney = this.data.couponMoney || 0;                          //优惠券金额


    var saleMoney = switchChecked ? vipPayMoney : 0;
    this.setData({ switchChecked, saleMoney })

    var pointMoney = this.data.pointMoney || 0;
    var pointsNum = this.data.pointsNum || 0;
    var remainMoney = this.data.remainMoney || 0;
    var lastmoney = Number(this.data.orderInfo.moneyrule.lastmoney);

    var lastcreadit = Number(this.data.orderInfo.creaditrule.lastcreadit), //总积分
      pointRate = this.data.orderInfo.creaditrule.rate; //积分兑换比率
    var _pointMoney = utils.myToFixed(lastcreadit * pointRate) //兑换总金额

    var isCheckPoint = this.data.isCheckPoint;
    var isBalancePayment = this.data.isBalancePayment;

    if (switchChecked) {

      if (isBalancePayment && !isCheckPoint) {
        remainMoney = (allMoney - pointMoney - saleMoney - couponMoney).toFixed(2);
        remainMoney = remainMoney >= lastmoney ? lastmoney : remainMoney;
        this.setData({ remainMoney })
      }

      if (isCheckPoint && !isBalancePayment) {
        pointMoney = utils.myToFixed(allMoney - remainMoney - saleMoney - couponMoney);
        pointMoney = pointMoney >= _pointMoney ? _pointMoney : pointMoney;
        pointsNum = Math.floor((pointMoney / pointRate) * 100) / 100 //兑换总金额
        this.setData({ pointMoney, pointsNum })
      }

      if (isBalancePayment && isCheckPoint) {
        remainMoney = (allMoney - saleMoney).toFixed(2);
        if (remainMoney >= lastmoney) {
          remainMoney = lastmoney;
          pointMoney = utils.myToFixed(allMoney - saleMoney - pointMoney - couponMoney);
          pointMoney = pointMoney >= _pointMoney ? _pointMoney : pointMoney;
          pointsNum = Math.floor((pointMoney / pointRate) * 100) / 100 //兑换总金额
        } else {
          remainMoney = remainMoney;
          pointMoney = 0;
          pointsNum = 0;
        }
        console.log(pointMoney)
        this.setData({ pointMoney, remainMoney, pointsNum })
        // remainMoney = remainMoney >= lastmoney ? lastmoney : remainMoney;
        // this.setData({ remainMoney })
      }

      // if()
    } else {
      if (isBalancePayment) {
        remainMoney = (allMoney - pointMoney - saleMoney - couponMoney).toFixed(2);
        remainMoney = remainMoney >= lastmoney ? lastmoney : remainMoney;
        this.setData({ remainMoney })
      }

      if (isCheckPoint) {
        pointMoney = (allMoney - remainMoney - saleMoney - couponMoney).toFixed(2);
        pointMoney = pointMoney >= _pointMoney ? _pointMoney : pointMoney;
        var pointsNum = utils.myToFixed(pointMoney / pointRate)//兑换总金额
        this.setData({ pointMoney, pointsNum })
      }
    }
    // var payMoney = allMoney-
    this.funcPayMoney();

  },
  balancePayment(e) { //余额支付    
    var payMoney = Number(this.data.payMoney),
      isBalancePayment = e.detail.value,
      lastmoney = Number(this.data.orderInfo.moneyrule.lastmoney);
    var remainMoney = 0;

    if (payMoney > 0 || !isBalancePayment) {
      // var remainMoney = (lastmoney >= payMoney) &&  isBalancePayment ? payMoney
      if (isBalancePayment) {
        remainMoney = lastmoney >= payMoney ? payMoney : lastmoney;
      } else {
        remainMoney = 0;
      }
    } else {
      isBalancePayment = false;
      utils.showMessage(this, '暂无可用余额或支付已满')
    }

    this.setData({ remainMoney, isBalancePayment })
    this.funcPayMoney();

  },
  usePoint(e) { //使用积分支付
    var payMoney = Number(this.data.payMoney),
      isCheckPoint = e.detail.value,
      lastcreadit = Number(this.data.orderInfo.creaditrule.lastcreadit), //总积分
      pointRate = this.data.orderInfo.creaditrule.rate; //积分兑换比率
    var _pointMoney = utils.myToFixed(lastcreadit * pointRate)//兑换总金额
    var pointMoney = 0, pointsNum = 0;

    if (payMoney > 0 || !isCheckPoint) {
      if (isCheckPoint) {
        pointMoney = _pointMoney >= payMoney ? payMoney : _pointMoney;
        pointsNum = Number((pointMoney / pointRate).toFixed(2))
        if (parseInt(pointsNum) != pointsNum) {
          pointsNum = parseInt(pointsNum);
          _pointMoney = utils.myToFixed(pointsNum * pointRate);
          pointMoney = _pointMoney >= payMoney ? payMoney : _pointMoney;
        }
        console.log(pointsNum)
      } else {
        pointMoney = 0;
        pointsNum = 0;
      }
    } else {
      isCheckPoint = false;
      utils.showMessage(this, '暂无可用积分或余额支付已满')
    }
    this.setData({ pointMoney, isCheckPoint, pointsNum })
    this.funcPayMoney();


  },
    
  bindInput(e) { //输入框
    var type = e.currentTarget.dataset.type;

    // var payMoney = this.data.payMoney; //总金额
    var allMoney = this.data.orderInfo.totalprice; //总金额
    var saleMoney = this.data.saleMoney || 0;
    var pointMoney = this.data.pointMoney || 0;
    var remianMoney = this.data.remainMoney || 0;
    var couponMoney = this.data.couponMoney || 0;
    var packvalue = this.data.packvalue || 0;
    var cutlery_money = this.data.cutlery_money || 0;
    var pointRate = this.data.orderInfo.creaditrule.rate; //积分兑换规则
    var allPoint = this.data.orderInfo.creaditrule.lastcreadit; //总积分
    var isCheckPoint = this.data.isCheckPoint;
    var isBalancePayment = this.data.isBalancePayment;
    // console.log(packvalue, cutlery_money)
    /**
     * 总金额  - 积分 - 余额   _remainMoney  remainMoney 超过 不超过显示
     */
    if (type == 'money') {//如果为会员
      var _payMoney = (Number(allMoney) - Number(saleMoney) - Number(pointMoney) - Number(couponMoney) + Number(cutlery_money)).toFixed(2);
      var _remainMoney = this.data.orderInfo.moneyrule.lastmoney; //余额支付金额
      _remainMoney = _remainMoney >= _payMoney ? Number(_payMoney) : Number(_remainMoney);
      var remainMoney = e.detail.value;
      remainMoney = _remainMoney >= remainMoney ? Number(remainMoney) : Number(_remainMoney);
      console.log(remainMoney, _remainMoney)
      remainMoney = Number(remainMoney).toFixed(2)
      this.setData({ remainMoney, _remainMoney: Number(remainMoney) })
      this.funcPayMoney('money');
    } else if (type == 'point') {//如果为积分
      var _payMoney = (Number(allMoney) - Number(saleMoney) - Number(remianMoney) - Number(couponMoney) + Number(cutlery_money)).toFixed(2);
      var _pointMoney = utils.myToFixed(allPoint * pointRate); //余额支付金额
      _payMoney = _pointMoney >= _payMoney ? _payMoney : _pointMoney;
      var _pointsNum = (_payMoney / pointRate).toFixed(2);
      var pointsNum = Number(e.detail.value);
      pointsNum = _pointsNum >= pointsNum ? pointsNum : _pointsNum;
      pointsNum = Number(Number(pointsNum).toFixed(2))
      var pointMoney = utils.myToFixed(pointsNum * pointRate);
      if (parseInt(pointsNum) != pointsNum) {
        pointsNum = parseInt(pointsNum);
        pointMoney = utils.myToFixed(pointsNum * pointRate);
        // pointMoney = _pointMoney >= payMoney ? payMoney : _pointMoney;
      }
      this.setData({ pointsNum, pointMoney })
      this.funcPayMoney('point');
    }
  },
  funcPayMoney(type) { //计算支付金额
    var packvalue = this.data.packvalue
    var orderInfo = this.data.orderInfo;    //获取信息
    if (this.data.tablesid < 0) {
      var allMoney = Number(orderInfo.totalprice) + Number(packvalue)  //总金额
    } else {
      var allMoney = Number(orderInfo.totalprice) + Number(this.data.cutlery_money)
    }
    console.log(allMoney)
    var saleMoney = this.data.saleMoney || 0; //折扣价
    var remainMoney = this.data.remainMoney || 0; //余额支付
    var pointMoney = this.data.pointMoney || 0; //积分支付
    var rate_money_to_point = orderInfo.memberInfo.hasOwnProperty('rate_money_to_point') && orderInfo.memberInfo.rate_money_to_point > 0 ? orderInfo.memberInfo.rate_money_to_point : 0; //每消费1元，送y积分  积分兑换规则 
    var couponMoney = this.data.couponMoney || 0;
    var payMoney = (allMoney - saleMoney - remainMoney - pointMoney - couponMoney).toFixed(2);

    var subMoney = (allMoney - saleMoney).toFixed(2); //减去折扣价后的总金额
    subMoney = subMoney > 0 ? subMoney : 0;

    var sendMoney = Number(allMoney - saleMoney - couponMoney - pointMoney);        //实际支付金额（包含余额）

    sendMoney = sendMoney >= 0 ? sendMoney : 0;
    // console.log(sendMoney)
    var sendPoints = parseInt(sendMoney * rate_money_to_point);

    var lastmoney = Number(this.data.orderInfo.moneyrule.lastmoney); //余额支付金额

    var isCheckPoint = this.data.isCheckPoint;
    var isBalancePayment = this.data.isBalancePayment;

    var pointRate = this.data.orderInfo.creaditrule.rate; //积分兑换规则
    var allPoint = this.data.orderInfo.creaditrule.lastcreadit; //总积分
    var _pointMoney = utils.myToFixed(allPoint * pointRate); //余额支付金额


    if (type != 'money') {
      var _remainMoney = (allMoney - saleMoney - pointMoney - couponMoney).toFixed(2);
      _remainMoney = lastmoney >= _remainMoney ? _remainMoney : lastmoney;

      this.setData({ _remainMoney })
    }

    if (type != 'point') {
      var _ptMoney = (allMoney - saleMoney - remainMoney - couponMoney).toFixed(2);
      _pointMoney = _pointMoney >= _ptMoney ? _ptMoney : _pointMoney;
      // _pointMoney = lastmoney >= _pointMoney ? lastmoney : _remainMoney;
      this.setData({ _pointMoney })
    }


    payMoney = payMoney > 0 ? payMoney : 0;
    sendPoints = sendPoints > 0 ? sendPoints : 0;

    this.setData({ payMoney, sendPoints, subMoney })


  },
  showDialog(e) { //点击显示弹窗
    var name = e.currentTarget.dataset.name,
      dialog = this.data.dialog,
      orderInfo = this.data.orderInfo;

    switch (name) {
      case 'vip':
        dialog.title = '会员折扣说明';
        dialog.text = `${orderInfo.memberInfo.cardtitle}今日全场菜品${orderInfo.mem_discount * 10}折优惠`;
        dialog.hidden = false;
        dialog.textAlign = '';
        this.setData({ dialog })
        break;
      case 'money':
        dialog.title = '余额支付说明';
        dialog.text = `钱包余额在收银时可最大化使用，余额明细可至我的余额-账单查看，如有疑问请联系商家客服。`;
        dialog.hidden = false;
        dialog.textAlign = 'left';
        this.setData({ dialog })
        break;
      case 'point':
        dialog.title = '积分抵扣说明';
        dialog.text = `${orderInfo.memberInfo.creaditrulestr}`;
        dialog.hidden = false;
        dialog.textAlign = 'left';
        this.setData({ dialog })
        break;
      default:
        break;
    }
  },
  affknow: function () {
    this.getData();
    this.setData({
      display: 'none',
      flagDialog: 'close',
    })
    wx.setStorageSync('flagDialog', 'close');
  },
  /**
   * 计算优惠券
   */
  funCoupon() {
    var ticker = wx.getStorageSync('ticker') || {};
    var orderInfo = this.data.orderInfo;
    var _couponlist = orderInfo.couponlist.list;
    console.log(_couponlist)
    var couponlist = [];
    var count = orderInfo.couponlist.count;
    var subMoney = this.data.subMoney; //减去折扣后的金额
    if (this.data.tablesid < 0) {
      var couponPrice = Number(this.data.totalprice) - Number(this.data.saleMoney)//商品价格  - 会员价格  + 配送价格
    } else {
      var couponPrice = Number(this.data.totalprice) - Number(this.data.saleMoney) //商品价格  - 会员价格  + 配送价格
    }
    console.log(couponPrice)
    var couponMoney = 0;
    var couponMsg = '';


    _couponlist.map((item, index) => {
      if (item.card_type == 5 && couponPrice >= item.value) {
        couponlist.push(item);
      }
      if (item.card_type == 4) {
        couponlist.push(item);
      }
    })

    console.log(couponlist)
    //是否有可用优惠券
    if (couponlist.length > 0) {
      console.log(utils.isEmpty(ticker))
      console.log(ticker.hasOwnProperty(orderInfo.id))
      if (!utils.isEmpty(ticker) && ticker.hasOwnProperty(orderInfo.id)) {
        //card_type 5现金抵扣券
        var _couponMoney = ticker[orderInfo.id].value;
        console.log(_couponMoney, couponPrice)
        if (ticker[orderInfo.id].card_type == 5) {
          if (couponPrice >= _couponMoney || this.data.isComeCoupon) {
            couponMsg = `-￥${_couponMoney}`
            couponMoney = _couponMoney
            this.setData({ coupon_record_id: ticker[orderInfo.id].id, card_id: ticker[orderInfo.id].card_id })
          } else {
            couponMsg = '无可用优惠券'
            couponMoney = 0
          }
        }

        if (ticker[orderInfo.id].card_type == 4) { //折扣券
          _couponMoney = (couponPrice * Number(1 - _couponMoney * 0.1)).toFixed(2);
          // _couponMoney = utils.myToFixed((subMoney * (1 - _couponMoney * 0.1)))
          if (couponPrice > 0 || this.data.isComeCoupon) {
            couponMsg = `-￥${_couponMoney}`
            couponMoney = _couponMoney
            console.log(_couponMoney)
            this.setData({ coupon_record_id: ticker[orderInfo.id].id, card_id: ticker[orderInfo.id].card_id })
          } else {
            couponMsg = '无可用优惠券'
            couponMoney = 0
          }
        }
      } else {
        couponMsg = `共${couponlist.length}张可用`
      }
    } else {
      couponMsg = '无可用优惠券'
    }
    this.setData({ couponMoney, couponMsg })
    this.funCouponYu();
  },
  /**
   * 有优惠券的使用
   */
  funCouponYu() {
    if (this.data.tablesid < 0) {//-1
      var allMoney = Number(this.data.orderInfo.totalprice) + Number(this.data.packvalue);  //总金额
      console.log(allMoney)
    } else {
      var allMoney = Number(this.data.orderInfo.totalprice) + Number(this.data.cutlery_money);

    }
    var saleMoney = this.data.saleMoney || 0;     //折扣价
    var remainMoney = this.data.remainMoney || 0; //余额支付
    var pointMoney = this.data.pointMoney || 0; //积分支付
    var couponMoney = this.data.couponMoney || 0;

    var payMoney = Number((allMoney - saleMoney - remainMoney - pointMoney - couponMoney).toFixed(2));

    var lastmoney = Number(this.data.orderInfo.moneyrule.lastmoney); //余额支付金额


    var isCheckPoint = this.data.isCheckPoint;
    var isBalancePayment = this.data.isBalancePayment;

    var pointRate = this.data.orderInfo.creaditrule.rate; //积分兑换规则
    var allPoint = this.data.orderInfo.creaditrule.lastcreadit; //总积分
    var _pointMoney = Number((allPoint * pointRate).toFixed(2)); //余额支付金额

    var _remainMoney = 0, remainMoney = 0, pointMoney = 0, pointNum = this.data.pointNum;
    //判断条件 选择优惠券&&(余额支付||积分支付开启)
    if (this.data.couponMoney > 0 || this.data.isComeCoupon) {
      // console.log(allMoney, saleMoney, couponMoney);
      var _cpmoney = (allMoney - saleMoney - couponMoney).toFixed(2);
      if (isBalancePayment || isCheckPoint) {
        if ((isBalancePayment && isCheckPoint) || (isBalancePayment && !isCheckPoint)) {
          if (lastmoney >= _cpmoney) {
            _remainMoney = _cpmoney;
            remainMoney = _remainMoney;
            _pointMoney = 0
            pointMoney = 0
            this.setData({ pointNum: 0, isCheckPoint: false })
          } else {
            _remainMoney = lastmoney;
            remainMoney = _remainMoney;
            _pointMoney = (_cpmoney - lastmoney).toFixed(2)
            pointMoney = _pointMoney
          }
        } else {
          if (_pointMoney >= _cpmoney) {
            _pointMoney = _cpmoney;
            pointMoney = _pointMoney;
            _remainMoney = 0
            _remainMoney = 0
          } else {
            remainMoney = (_cpmoney - _pointMoney).toFixed(2)
            remainMoney = _remainMoney;
          }
        }

      }
      payMoney = Number((allMoney - saleMoney - remainMoney - pointMoney - couponMoney).toFixed(2));
      this.setData({ _remainMoney, _pointMoney, remainMoney, pointMoney, payMoney })
    }

  },
  // 选择自提时间
  chooseDate(e) {
    let idx = e.currentTarget.dataset.idx;
    this.setData({ wkIdx: idx });
  },
  // showChangeTime
  showChangeTime() {
    this.setData({ showTime: true });
  },

  //   *---------------------
  showPickerTime() { //控制PICKTIME显示隐藏
    this.setData({
      isTime: !this.data.isTime
    })
    this.countZTtime();
  },
  pickerDay(e) { //选择某一天
    let index = e.currentTarget.dataset.index;
    console.log(index)
    this.setData({
      pickerTimeIndex: index,
      pickerTimeRight: this.data.pickerTimeList[index].time_list,
      pickerTimeRightIndex: 0
    })
  },
  pickerHour(e) { //选择精确时间
    let index = e.currentTarget.dataset.index;
    this.setData({
      pickerTimeRightIndex: index
    })
    this.showPickerTime();
  },
  countZTtime() { //计算zTtime时间
    let ztTime = null;
    if (this.data.pickerTimeIndex == 0 && this.data.pickerTimeRightIndex == null) {
      ztTime = '请选择取餐时间'
      return;
    } else if (this.data.pickerTimeIndex == 0 && this.data.pickerTimeRightIndex == 0) {

      ztTime = '支付成功直接取餐'
      wx.setStorageSync('trueTime', ztTime)
      this.setData({
        trueTime: ztTime
      })
    } else {
      ztTime = this.data.pickerTimeList[this.data.pickerTimeIndex].day + ' ' + this.data.pickerTimeList[this.data.pickerTimeIndex].time_list[this.data.pickerTimeRightIndex]
      this.setData({
        trueTime: ztTime
      })
      wx.setStorageSync('trueTime', ztTime)
    }
    this.setData({
      ztTime
    })
  },
  getPhoneNumber: function (e) {
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      var that = this;
      var iv = encodeURIComponent(e.detail.iv);
      var enData = encodeURIComponent(e.detail.encryptedData);
      var token = wx.getStorageSync('access_token') || '';
      wx.request({
        url: 'https://op.tiantianremai.cn/v1/auth/getPhoneNum',
        data: {
          code: code,
          shopId: app.shopId,
          enData: enData,
          iv: iv
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data.data)
          that.setData({
            mobile: res.data.data.data.phoneNumber
          })
          console.log(that.data.mobile)
          wx.login({
            success: function (res) {
              code = encodeURIComponent(res.code);
            }
          });
        }
      })
    }
  }
  // getPickerTime() { //获取PICKERTIME数据
  //     let shopId = wx.getStorageSync('shop_id'),
  //         location = wx.getStorageSync('addressFlag'),
  //         _that = this;
  //     wx.request({
  //         url: app._host + `?ctrl=wxapp&action=getFoodTime&id=${shopId}&lat=${location.lat}&lng=${location.lng}&version=${app._version}`,
  //         success: function (res) {
  //             _that.setData({
  //                 pickerTimeList: res.data.data,
  //                 pickerTimeRight: res.data.data[_that.data.pickerTimeIndex]['time_list'],
  //                 ztTime: "请选择取餐时间",
  //             })
  //         }
  //     })
  // },
})
